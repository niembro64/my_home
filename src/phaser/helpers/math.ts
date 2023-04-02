export const getNormalizedVector = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number } => {
  let newX = endX - startX;
  let newY = endY - startY;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
};
