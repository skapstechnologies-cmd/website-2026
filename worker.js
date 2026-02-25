export default {
  async fetch(request, env, ctx) {
    // Handle CORS for frontend
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const email = formData.get('email');
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const phone = formData.get('phone');
      const company = formData.get('company');

      // Form validation
      const errors = validateForm({ email, firstName, lastName, phone, company });
      if (errors.length > 0) {
        return new Response(JSON.stringify({ success: false, errors }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // Check if email already exists in D1
      const existingUser = await env.DB.prepare(
        'SELECT id FROM leads WHERE email = ?'
      ).bind(email).first();

      if (existingUser) {
        return new Response(JSON.stringify({ 
          success: false, 
          errors: ['Email already exists. Please use a different email or contact support.'] 
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 409
        });
      }

      // Create/update in D1 database
      const now = new Date().toISOString();
      let d1Result;
      
      if (existingUser) {
        // Update existing lead
        d1Result = await env.DB.prepare(
          `UPDATE leads 
           SET first_name = ?, last_name = ?, phone = ?, company = ?, updated_at = ?
           WHERE email = ?`
        ).bind(firstName, lastName, phone, company, now, email).run();
      } else {
        // Create new lead
        d1Result = await env.DB.prepare(
          `INSERT INTO leads (email, first_name, last_name, phone, company, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(email, firstName, lastName, phone, company, now, now).run();
      }

      // Sync to Zoho CRM
      const zohoResponse = await syncToZohoCRM({
        email,
        firstName,
        lastName,
        phone,
        company
      }, env.ZOHO_ACCESS_TOKEN, env.ZOHO_CLIENT_ID);

      if (!zohoResponse.success) {
        // Log error but continue - D1 is the primary store
        console.error('Zoho CRM sync failed:', zohoResponse.error);
      }

      // Redirect to success page
      return Response.redirect(env.REDIRECT_URL || '/thank-you', 302);
      
    } catch (error) {
      console.error('Form submission error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        errors: ['An error occurred. Please try again.'] 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }
  }
};

// Form validation function
function validateForm(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('First name is required');
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Last name is required');
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.push('Please provide a valid phone number');
  }

  if (!data.company || data.company.trim().length < 2) {
    errors.push('Company name is required');
  }

  return errors;
}

// Email validation regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Zoho CRM API sync function
async function syncToZohoCRM(leadData, accessToken, clientId) {
  const zohoCRM_URL = 'https://crm.zoho.com/crm/private/json/Leads/createRecords';

  try {
    const response = await fetch(zohoCRM_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          Lead_Source: 'Website Form',
          First_Name: leadData.firstName,
          Last_Name: leadData.lastName,
          Email: leadData.email,
          Phone: leadData.phone,
          Company: leadData.company,
          Created_By: clientId
        }]
      })
    });

    const result = await response.json();
    
    if (result.response.error) {
      return {
        success: false,
        error: result.response.error.message || 'Failed to sync to Zoho CRM'
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
