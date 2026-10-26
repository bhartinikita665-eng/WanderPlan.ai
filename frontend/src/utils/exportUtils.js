export function exportToJSON(trip) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(trip, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const filename = `${trip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.json`;
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportToMarkdown(trip) {
  let md = `# ${trip.title}\n`;
  md += `**Destination:** ${trip.destination}  \n`;
  md += `**Travelers:** ${trip.preferences.traveler_type} (${trip.preferences.group_size} travelers)  \n`;
  md += `**Dates:** ${trip.preferences.start_date} to ${trip.preferences.end_date}  \n`;
  md += `**Total Estimated Cost:** ${trip.cost_breakdown.currency} ${trip.cost_breakdown.total_estimated_cost} (${trip.cost_breakdown.currency} ${trip.cost_breakdown.per_person_cost} / person)  \n\n`;

  if (trip.travel_advisory) {
    md += `> **Insider Advisory:** ${trip.travel_advisory}\n\n`;
  }

  md += `## Daily Itinerary\n\n`;
  trip.days.forEach((day) => {
    md += `### Day ${day.day_number}: ${day.title} (${day.date})\n`;
    md += `${day.summary}\n\n`;
    md += `**Transportation:** ${day.transportation_advice}\n\n`;
    
    md += `#### Scheduled Activities:\n`;
    day.activities.forEach((act) => {
      md += `- **${act.time_label} - ${act.title}** (${act.category})\n`;
      md += `  ${act.description}\n`;
      if (act.insider_tip) md += `  *Tip: ${act.insider_tip}*\n`;
      md += `  *Location:* ${act.location_name} | *Cost:* $${act.estimated_cost}\n\n`;
    });

    if (day.dining && day.dining.length > 0) {
      md += `#### Recommended Dining:\n`;
      day.dining.forEach((d) => {
        md += `- **${d.meal.toUpperCase()}:** ${d.name} (${d.cuisine}, ${d.price_tier}) - *${d.signature_dish || d.recommendation_reason}*\n`;
      });
      md += `\n`;
    }

    if (day.accommodation) {
      md += `#### Stay:\n`;
      md += `**${day.accommodation.name}** (${day.accommodation.type}, ${day.accommodation.neighborhood}) - ~$${day.accommodation.estimated_cost_per_night}/night\n\n`;
    }
    md += `---\n\n`;
  });

  if (trip.packing_suggestions && trip.packing_suggestions.length > 0) {
    md += `## Packing Suggestions\n`;
    trip.packing_suggestions.forEach((item) => {
      md += `- [ ] ${item}\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${trip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function printItinerary() {
  window.print();
}
