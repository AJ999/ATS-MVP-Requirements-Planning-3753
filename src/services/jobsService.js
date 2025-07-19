import supabase from '../lib/supabase';

const TABLE_NAME = 'jobs_x7y5z9w8';

export const getAllJobs = async (companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
      
    // Filter by company_id if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (jobId, companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('job_id', jobId);
      
    // Add company filter if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    throw error;
  }
};

export const createJob = async (jobData, companyId) => {
  try {
    if (!companyId) {
      throw new Error('Company ID is required to create a job');
    }
    
    const now = new Date().toISOString();
    
    const jobToInsert = {
      ...jobData,
      company_id: companyId,
      created_at: now,
      updated_at: now,
      status: jobData.status || 'draft'
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([jobToInsert])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData, companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .update({
        ...jobData,
        updated_at: new Date().toISOString()
      })
      .eq('job_id', jobId);
      
    // Add company verification if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating job ${jobId}:`, error);
    throw error;
  }
};

export const deleteJob = async (jobId, companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .delete()
      .eq('job_id', jobId);
      
    // Add company verification if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { error } = await query;
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting job ${jobId}:`, error);
    throw error;
  }
};