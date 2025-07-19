import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronLeft, FiChevronRight } = FiIcons;

const CalendarView = ({ interviews, onSelectInterview }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get all days in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get interviews for the selected date
  const selectedDateInterviews = interviews.filter(interview =>
    isSameDay(new Date(interview.scheduled_date), selectedDate)
  );

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Get count of interviews for a specific date
  const getInterviewCount = (date) => {
    return interviews.filter(interview =>
      isSameDay(new Date(interview.scheduled_date), date)
    ).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Interview Calendar</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiChevronLeft} className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-900 font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Week day headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div
            key={day}
            className="bg-gray-100 text-center py-2 text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before start of month */}
        {Array(monthStart.getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-start-${index}`} className="bg-white" />
          ))}

        {/* Calendar days */}
        {days.map(day => {
          const interviewCount = getInterviewCount(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`bg-white hover:bg-gray-50 cursor-pointer p-2 min-h-[80px] border border-transparent ${
                isSelected ? 'border-primary-500 bg-primary-50' : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div
                className={`text-right ${
                  isTodayDate ? 'text-primary-600 font-bold' : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
              {interviewCount > 0 && (
                <div className="mt-1">
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                    {interviewCount} {interviewCount === 1 ? 'interview' : 'interviews'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty cells for days after end of month */}
        {Array(6 - monthEnd.getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-end-${index}`} className="bg-white" />
          ))}
      </div>

      {/* Selected Date Interviews */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h4>
        {selectedDateInterviews.length > 0 ? (
          <div className="space-y-2">
            {selectedDateInterviews.map(interview => (
              <motion.div
                key={interview.interview_id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg cursor-pointer ${
                  interview.status === 'scheduled'
                    ? 'bg-blue-50'
                    : interview.status === 'completed'
                    ? 'bg-green-50'
                    : interview.status === 'cancelled'
                    ? 'bg-red-50'
                    : 'bg-gray-50'
                }`}
                onClick={() => onSelectInterview(interview)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {interview.candidate_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {interview.job_title}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(interview.scheduled_date), 'h:mm a')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No interviews scheduled for this date
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;