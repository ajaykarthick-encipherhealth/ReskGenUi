const ReusableDot = ({ color = "#000", size = 8 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  );
export default ReusableDot;