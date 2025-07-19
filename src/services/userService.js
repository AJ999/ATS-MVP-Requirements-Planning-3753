import supabase from '../lib/supabase';

// Define the table name for users
const TABLE_NAME = 'users_x7y5z9w8';

/**
 * Get a user by email
 * @param {string} email - User email to look up
 * @returns {Promise<Object>} - User data or null if not found
 */
export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    return null;
  }
};

/**
 * Get a user by ID
 * @param {string} userId - User ID to look up
 * @returns {Promise<Object>} - User data or null if not found
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} - Created user data
 */
export const createUser = async (userData) => {
  try {
    const now = new Date().toISOString();
    
    // Generate a user ID if not provided
    if (!userData.user_id) {
      userData.user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    const userToInsert = {
      user_id: userData.user_id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: userData.role || 'user',
      company_id: userData.company_id || null,
      created_at: now,
      updated_at: now,
      is_active: true,
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([userToInsert])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param {string} userId - User ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Upload a profile picture for a user
 * @param {string} userId - User ID
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} - Upload result with URL
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    // In a real app, this would upload to Supabase Storage
    // For the demo, we'll simulate a successful upload
    
    // Create a file path
    const filePath = `profile_pictures/${userId}/${Date.now()}_${file.name}`;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock result
    return {
      success: true,
      profile_picture: URL.createObjectURL(file),
      filePath
    };
  } catch (error) {
    console.error(`Error uploading profile picture for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get all users for a company
 * @param {string} companyId - Company ID to filter by
 * @returns {Promise<Array>} - Array of users
 */
export const getCompanyUsers = async (companyId) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching users for company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Update user role
 * @param {string} userId - User ID to update
 * @param {string} newRole - New role to assign
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserRole = async (userId, newRole, companyId) => {
  try {
    // Validate role
    const validRoles = ['owner', 'admin', 'recruiter', 'secretary', 'client'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    throw error;
  }
};