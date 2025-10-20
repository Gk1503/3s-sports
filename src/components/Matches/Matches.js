// MatchesPage.jsx
import React, { useState } from "react";
import "./Matches.css";
import teamA1 from "../../images/Team.jpg";
import teamA2 from "../../images/Team.jpg";
import teamB1 from "../../images/Team.jpg";
import teamB2 from "../../images/Team.jpg";

const MatchesPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const matches = [
    {
      id: 1,
      teamA: "3SPORTS A",
      teamAImg: teamA1,
      teamB: "3SPORTS B",
      teamBImg: teamB1,
      date: "2025-11-01",
      venue: "National Cricket Ground",
      result: "3SPORTS A won by 20 runs",
      description: "Exciting match with strong batting by 3SPORTS A."
    },
    {
      id: 2,
      teamA: "3SPORTS C",
      teamAImg: teamA2,
      teamB: "3SPORTS D",
      teamBImg: teamB2,
      date: "2025-11-05",
      venue: "City Cricket Academy",
      result: "3SPORTS D won by 5 wickets",
      description: "3SPORTS D chased successfully with excellent bowling."
    },
    {
      id: 3,
      teamA: "3SPORTS A",
      teamAImg: teamA1,
      teamB: "3SPORTS C",
      teamBImg: teamB2,
      date: "2025-11-10",
      venue: "Central Stadium",
      result: "Match Scheduled",
      description: "Upcoming match, details will be updated after play."
    }
  ];

  const openModal = (match) => {
    setSelectedMatch(match);
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

  return (
    <div id="matches-page">
      <section id="matches-hero">
        <h1 id="matches-hero-title">3SPORTS Matches</h1>
        <p id="matches-hero-subtitle">Check upcoming and past matches with scores & details</p>
      </section>

      <section id="matches-section">
        <div id="matches-grid">
          {matches.map((match) => (
            <div id="match-card" key={match.id} onClick={() => openModal(match)}>
              <div id="match-teams">
                <div id="teamA">
                  <img src={match.teamAImg} alt={match.teamA} />
                  <p>{match.teamA}</p>
                </div>
                <span id="vs-text">VS</span>
                <div id="teamB">
                  <img src={match.teamBImg} alt={match.teamB} />
                  <p>{match.teamB}</p>
                </div>
              </div>
              <p id="match-date">{match.date}</p>
              <p id="match-venue">{match.venue}</p>
              <p id="match-result">{match.result}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Match Modal */}
      {selectedMatch && (
        <div id="match-modal">
          <div id="match-modal-content">
            <span id="match-modal-close" onClick={closeModal}>&times;</span>
            <h2 id="modal-match-title">{selectedMatch.teamA} VS {selectedMatch.teamB}</h2>
            <div id="modal-teams">
              <img src={selectedMatch.teamAImg} alt={selectedMatch.teamA} />
              <span id="modal-vs">VS</span>
              <img src={selectedMatch.teamBImg} alt={selectedMatch.teamB} />
            </div>
            <p id="modal-match-date"><strong>Date:</strong> {selectedMatch.date}</p>
            <p id="modal-match-venue"><strong>Venue:</strong> {selectedMatch.venue}</p>
            <p id="modal-match-result"><strong>Result:</strong> {selectedMatch.result}</p>
            <p id="modal-match-desc">{selectedMatch.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
