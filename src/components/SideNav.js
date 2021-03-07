import React from "react";

const SideNav = () => {
  const width = 200;
  const height = 100;
  const [xPosition, setX] = React.useState(-width);

  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
    } else {
      setX(-width);
    }
  };

  const toggleBackground = (type) => {
    const bodyElt = document.querySelector("body");
    if (type === 'dark') {
      if (!bodyElt.classList.contains('dark')) {
        bodyElt.classList.add('dark');
      }
      if (bodyElt.classList.contains('light')) {
        bodyElt.classList.remove('light');
      }
      
    } else if (type === 'light') {
      if (!bodyElt.classList.contains('light')) {
        bodyElt.classList.add('light');
      }
      if (bodyElt.classList.contains('dark')) {
        bodyElt.classList.remove('dark');
      }
    }
  }

  React.useEffect(() => {
    setX(0);
  }, []);
  return (
    <React.Fragment>
      <div
        className="side-bar"
        style={{
          transform: `translatex(${xPosition}px)`,
          width: width,
          Height: height
        }}
      >
        <button
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={{
            transform: `translate(${width}px, 0vh)`
          }}
        ></button>
        <div className="content">
          <button className="action" onClick={() => toggleBackground('dark')}>Dark</button>
          <button className="action" onClick={() => toggleBackground('light')}>Light</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SideNav;