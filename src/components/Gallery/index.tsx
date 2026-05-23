import { useState } from "react";
import { categories } from "./data";
import Item from "./modules/Item";
import "./gallery.scss";

const Gallery = () => {
  const [activeId, setActiveId] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeId);

  return (
    <div className="cell gallery">
      <div className="gallery-nav">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`gallery-nav-tab${activeId === c.id ? " gallery-nav-tab--active" : ""}`}
            onClick={() => setActiveId(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {active?.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
