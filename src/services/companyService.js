import supabase from '../lib/supabase';

const TABLE_NAME = 'companies_x7y5z9w8';

export const createCompany = async (companyData) => {
  try {
    const now = new Date().toISOString();
    const companyToInsert = {
      name: companyData.name,
      industry: companyData.industry || null,
      website: companyData.website || null,
      address: companyData.address || null,
      phone: companyData.phone || null,
      description: companyData.description || null,
      logo_url: companyData.logo_url || null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([companyToInsert])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createCompany:', error);
    throw error;
  }
};

export const getCompanyById = async (companyId) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    throw error;
  }
};

export const updateCompany = async (companyId, companyData) => {
  try {
    const updateData = {
      name: companyData.name,
      industry: companyData.industry || null,
      website: companyData.website || null,
      address: companyData.address || null,
      phone: companyData.phone || null,
      description: companyData.description || null,
      logo_url: companyData.logo_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
};