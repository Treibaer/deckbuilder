const tickets = [
  {
    id: 1,
    slug: "TB-1",
    title: "Ticket 1",
    description: "This is ticket 1",
  },
  {
    id: 2,
    slug: "TB-2",
    title: "Ticket 2",
    description: "This is ticket 2",
  },
  {
    id: 3,
    slug: "TB-3",
    title: "Ticket 3",
    description: "This is ticket 3",
  },
];
import { useState } from "react";
// import css
import "./TicketOverview.css";

export default function TicketOverview() {
  const [createNew, setCreateNew] = useState(false);

  console.log("TicketOverview.jsx");
  return (
    <>
      {createNew && (
        <div className="tb-dialog react-menu tb-dropdown-menu tb-transparent-menu">
          <div className="tb-dialog-title">Create new ticket</div>
          <input type="text" placeholder="Title" />
        </div>
      )}
      <div>
        <div className="tb-title-bar">
          <div className="tb-title">Tickets</div>
          <div className="tb-inline-button" onClick={() => setCreateNew(true)}>
            <img src="https://n2.treibaer.de/svg/new.svg" />
          </div>
        </div>
        <p>Here you can see all your tickets</p>
        <div className="tb-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="tb-list-item">
              <div className="gray">{ticket.slug}</div>
              <div>{ticket.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
