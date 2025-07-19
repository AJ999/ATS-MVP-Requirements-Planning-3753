import supabase from '../lib/supabase';

const TABLE_NAME = 'workflows_xn48sz9';

/**
 * Get all workflows for a company
 * @param {string} companyId - Company ID to filter by (optional)
 * @returns {Promise<Array>} - Array of workflows
 */
export const getWorkflows = async (companyId = null) => {
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
      throw new Error(`Failed to fetch workflows: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getWorkflows:', error);
    throw error;
  }
};

/**
 * Get a workflow by ID
 * @param {string} id - Workflow ID
 * @param {string} companyId - Company ID for verification (optional)
 * @returns {Promise<Object>} - Workflow data
 */
export const getWorkflowById = async (id, companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id);
    
    // Add company filter if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      throw new Error(`Failed to fetch workflow: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new workflow
 * @param {Object} workflowData - Workflow data
 * @returns {Promise<Object>} - Created workflow
 */
export const createWorkflow = async (workflowData) => {
  try {
    const now = new Date().toISOString();
    
    const workflowToInsert = {
      ...workflowData,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([workflowToInsert])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create workflow: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createWorkflow:', error);
    throw error;
  }
};

/**
 * Update an existing workflow
 * @param {string} id - Workflow ID to update
 * @param {Object} workflowData - Updated workflow data
 * @param {string} companyId - Company ID for verification (optional)
 * @returns {Promise<Object>} - Updated workflow
 */
export const updateWorkflow = async (id, workflowData, companyId = null) => {
  try {
    const updateData = {
      ...workflowData,
      updated_at: new Date().toISOString()
    };
    
    let query = supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id);
    
    // Add company verification if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update workflow: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating workflow ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a workflow
 * @param {string} id - Workflow ID to delete
 * @param {string} companyId - Company ID for verification (optional)
 * @returns {Promise<Object>} - Success status
 */
export const deleteWorkflow = async (id, companyId = null) => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    // Add company verification if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { error } = await query;
    
    if (error) {
      throw new Error(`Failed to delete workflow: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting workflow ${id}:`, error);
    throw error;
  }
};