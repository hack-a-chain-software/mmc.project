
export const If = ({
  children,
  condition,
  fallback = null,
}) => {
  return (
    <div>
      { condition ? children : fallback || null }
    </div>
  );
};
