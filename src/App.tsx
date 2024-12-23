import React from "react";
import SmartInputInt from "./components/smart-input-int";

function App() {
  const [value, setValue] = React.useState<string>("0");

  React.useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <p>smart input integer</p>
      <SmartInputInt
        className="border focus-visible:outline-none"
        input={value}
        min={0}
        max={100}
        onInputChange={(v) => setValue(v)}
      />
    </div>
  );
}

export default App;
