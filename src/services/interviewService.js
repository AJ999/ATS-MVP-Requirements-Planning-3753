import supabase from '../lib/supabase';

const TABLE_NAME = 'interviews_bv73k2f9';
const APPLICATIONS_TABLE = 'applications_65a9bc7d';
const CANDIDATES_TABLE = 'candidates_65a9bc7d';
const JOBS_TABLE = 'jobs_65a9bc7d';

/**
 * Get all interviews for a company with related data
 * @param {string} companyId - Company ID to filter by
 * @returns {Promise<Array>} - Array of interviews with candidate and job data
 */
export const getInterviews = async (companyId) => {
  try {
    if (!companyId) {
      throw new Error('Company ID is required to fetch interviews');
    }
    
    // First get all interviews for the company
    const { data: interviews, error: interviewsError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('company_id', companyId)
      .order('scheduled_date', { ascending: true });
    
    if (interviewsError) {
      console.error('Error fetching interviews:', interviewsError);
      throw interviewsError;
    }
    
    if (!interviews || interviews.length === 0) {
      return [];
    }
    
    // Get all unique application IDs from interviews
    const applicationIds = [...new Set(interviews.map(interview => interview.application_id).filter(Boolean))];
    
    if (applicationIds.length === 0) {
      return interviews;
    }
    
    // Fetch applications with candidate and job data
    const { data: applications, error: applicationsError } = await supabase
      .from(APPLICATIONS_TABLE)
      .select(`
        *,
        candidates:candidate_id (
          candidate_id,
          first_name,
          last_name,
          email,
          phone,
          location
        ),
        jobs:job_id (
          job_id,
          title,
          department,
          location
        )
      `)
      .in('application_id', applicationIds);
    
    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
      // Return interviews without enriched data if applications fetch fails
      return interviews;
    }
    
    // Create a map for quick lookup
    const applicationMap = new Map();
    applications?.forEach(app => {
      applicationMap.set(app.application_id, app);
    });
    
    // Enrich interviews with candidate and job data
    const enrichedInterviews = interviews.map(interview => {
      const application = applicationMap.get(interview.application_id);
      return {
        ...interview,
        application: application || null,
        candidate: application?.candidates || null,
        job: application?.jobs || null
      };
    });
    
    return enrichedInterviews;
  } catch (error) {
    console.error('Error in getInterviews:', error);
    throw error;
  }
};

/**
 * Get an interview by ID with related data
 * @param {string} interviewId - Interview ID
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Interview data with candidate and job info
 */
export const getInterviewById = async (interviewId, companyId) => {
  try {
    if (!interviewId || !companyId) {
      throw new Error('Interview ID and Company ID are required');
    }
    
    const { data: interview, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('interview_id', interviewId)
      .eq('company_id', companyId)
      .single();
    
    if (error) {
      console.error(`Error fetching interview ${interviewId}:`, error);
      throw error;
    }
    
    if (interview.application_id) {
      // Fetch related application, candidate, and job data
      const { data: application, error: appError } = await supabase
        .from(APPLICATIONS_TABLE)
        .select(`
          *,
          candidates:candidate_id (
            candidate_id,
            first_name,
            last_name,
            email,
            phone,
            location
          ),
          jobs:job_id (
            job_id,
            title,
            department,
            location
          )
        `)
        .eq('application_id', interview.application_id)
        .single();
      
      if (!appError && application) {
        interview.application = application;
        interview.candidate = application.candidates;
        interview.job = application.jobs;
      }
    }
    
    return interview;
  } catch (error) {
    console.error(`Error in getInterviewById for ${interviewId}:`, error);
    throw error;
  }
};

/**
 * Create a new interview
 * @param {Object} interviewData - Interview data
 * @returns {Promise<Object>} - Created interview
 */
export const createInterview = async (interviewData) => {
  try {
    if (!interviewData.company_id) {
      throw new Error('Company ID is required to create an interview');
    }
    
    // Generate a unique ID if not provided
    if (!interviewData.interview_id) {
      interviewData.interview_id = `interview_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    const now = new Date().toISOString();
    const interviewToInsert = {
      ...interviewData,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([interviewToInsert])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating interview:', error);
      throw error;
    }
    
    // Fetch the created interview with related data
    return await getInterviewById(data.interview_id, data.company_id);
  } catch (error) {
    console.error('Error in createInterview:', error);
    throw error;
  }
};

/**
 * Update an existing interview
 * @param {string} interviewId - Interview ID to update
 * @param {Object} interviewData - Updated interview data
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Updated interview
 */
export const updateInterview = async (interviewId, interviewData, companyId) => {
  try {
    if (!interviewId || !companyId) {
      throw new Error('Interview ID and Company ID are required');
    }
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...interviewData,
        updated_at: new Date().toISOString()
      })
      .eq('interview_id', interviewId)
      .eq('company_id', companyId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating interview ${interviewId}:`, error);
      throw error;
    }
    
    // Fetch the updated interview with related data
    return await getInterviewById(data.interview_id, data.company_id);
  } catch (error) {
    console.error(`Error in updateInterview for ${interviewId}:`, error);
    throw error;
  }
};

/**
 * Delete an interview
 * @param {string} interviewId - Interview ID to delete
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Success status
 */
export const deleteInterview = async (interviewId, companyId) => {
  try {
    if (!interviewId || !companyId) {
      throw new Error('Interview ID and Company ID are required');
    }
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('interview_id', interviewId)
      .eq('company_id', companyId);
    
    if (error) {
      console.error(`Error deleting interview ${interviewId}:`, error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteInterview for ${interviewId}:`, error);
    throw error;
  }
};

/**
 * Update interview status
 * @param {string} interviewId - Interview ID
 * @param {string} status - New status
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Updated interview
 */
export const updateInterviewStatus = async (interviewId, status, companyId) => {
  try {
    if (!interviewId || !status || !companyId) {
      throw new Error('Interview ID, status, and Company ID are required');
    }
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('interview_id', interviewId)
      .eq('company_id', companyId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating interview status for ${interviewId}:`, error);
      throw error;
    }
    
    // Fetch the updated interview with related data
    return await getInterviewById(data.interview_id, data.company_id);
  } catch (error) {
    console.error(`Error in updateInterviewStatus for ${interviewId}:`, error);
    throw error;
  }
};

/**
 * Add feedback to an interview
 * @param {string} interviewId - Interview ID
 * @param {Object} feedbackData - Feedback data
 * @param {string} companyId - Company ID for verification
 * @returns {Promise<Object>} - Updated interview
 */
export const addInterviewFeedback = async (interviewId, feedbackData, companyId) => {
  try {
    if (!interviewId || !feedbackData || !companyId) {
      throw new Error('Interview ID, feedback data, and Company ID are required');
    }
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        feedback: feedbackData,
        rating: feedbackData.rating || null,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('interview_id', interviewId)
      .eq('company_id', companyId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error adding feedback to interview ${interviewId}:`, error);
      throw error;
    }
    
    // Fetch the updated interview with related data
    return await getInterviewById(data.interview_id, data.company_id);
  } catch (error) {
    console.error(`Error in addInterviewFeedback for ${interviewId}:`, error);
    throw error;
  }
};