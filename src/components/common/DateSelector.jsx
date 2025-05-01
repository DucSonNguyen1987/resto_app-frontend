// src/components/common/DateSelector.jsx
import React, { useState } from 'react';
import '../../styles/DateSelector.css';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Obtenir la date du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Formater la date pour l'affichage
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Générer les dates pour les 7 prochains jours
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  };
  
  // Obtenir le premier jour du mois actuel
  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0 = dimanche, 1 = lundi, etc.
  };
  
  // Obtenir le nombre de jours dans le mois actuel
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Générer un calendrier pour le mois
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getFirstDayOfMonth(selectedDate);
    
    // Ajuster pour commencer par lundi (1) au lieu de dimanche (0)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Créer un tableau représentant tous les jours du mois
    const days = [];
    
    // Ajouter les jours vides pour le début du mois
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }
    
    // Grouper les jours par semaine
    const weeks = [];
    let week = [];
    
    days.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        weeks.push(week);
        week = [];
      }
      week.push(day);
    });
    
    // Ajouter la dernière semaine si elle n'est pas complète
    if (week.length > 0) {
      // Remplir avec des jours null pour compléter la semaine
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
    
    return weeks;
  };
  
  // Passer au mois précédent
  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };
  
  // Passer au mois suivant
  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };
  
  // Sélectionner une date spécifique
  const selectDate = (date) => {
    if (date) {
      onDateChange(date);
      setShowCalendar(false);
    }
  };
  
  // Vérifier si une date est aujourd'hui
  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };
  
  // Vérifier si une date est sélectionnée
  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  
  return (
    <div className="date-selector">
      <div className="selected-date" onClick={() => setShowCalendar(!showCalendar)}>
        <span>{formatDate(selectedDate)}</span>
        <i className={`fas fa-chevron-${showCalendar ? 'up' : 'down'}`}></i>
      </div>
      
      {showCalendar && (
        <div className="date-dropdown">
          <div className="quick-dates">
            <h4>Sélection rapide</h4>
            <ul className="date-list">
              {generateDates().map((date, index) => (
                <li
                  key={index}
                  className={`date-item ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                  onClick={() => selectDate(date)}
                >
                  <span className="day-name">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                  <span className="day-number">{date.getDate()}</span>
                  <span className="month-name">{date.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="calendar">
            <div className="calendar-header">
              <button
                className="prev-month"
                onClick={prevMonth}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="current-month">
                {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                className="next-month"
                onClick={nextMonth}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="calendar-grid">
              <div className="weekdays">
                <div className="weekday">Lun</div>
                <div className="weekday">Mar</div>
                <div className="weekday">Mer</div>
                <div className="weekday">Jeu</div>
                <div className="weekday">Ven</div>
                <div className="weekday">Sam</div>
                <div className="weekday">Dim</div>
              </div>
              
              <div className="days">
                {generateCalendar().map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="week">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`day-${weekIndex}-${dayIndex}`}
                        className={`day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
                        onClick={() => day && selectDate(day)}
                      >
                        {day && day.getDate()}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;