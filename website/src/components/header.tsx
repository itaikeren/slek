import Calendar from "slek";

function Header({ monthStyle = "full" }: { monthStyle?: "full" | "short" }) {
  const LeftStrokeChevron = () => (
    <svg width="12" height="12" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L2 10L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const RightStrokeChevron = () => (
    <svg width="12" height="12" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L10 10L2 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <Calendar.Headline monthStyle={monthStyle} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Calendar.PrevButton>
          <LeftStrokeChevron />
        </Calendar.PrevButton>
        <Calendar.NextButton>
          <RightStrokeChevron />
        </Calendar.NextButton>
      </div>
    </>
  );
}

export default Header;
