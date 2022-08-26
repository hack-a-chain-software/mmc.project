export function Button({
  children,
  onClick,
  className = "",
}: {
  children: any;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      children={children}
      onClick={() => onClick()}
      className={
        "bg-purple0 text-white uppercase min-h-[40px] px-[13px] text-[15px] tracking-[0px] border border-white rounded-[50px] " +
        className
      }
    />
  );
}
