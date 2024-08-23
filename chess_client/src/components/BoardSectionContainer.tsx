interface BoardSectionContainerProps {
  children: React.ReactNode;
}
export default function BoardSectionContainer({
  children,
}: BoardSectionContainerProps) {
  return (
    <div className='boardSectionContainer lg:mb-6'>
      <div className='boardSection'>{children}</div>
    </div>
  );
}
