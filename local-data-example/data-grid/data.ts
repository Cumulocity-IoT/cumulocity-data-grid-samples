export type ExampleStructure = {
  id: string | number;
  name: string;
  temperature: number;
};

export function createMockedData(count: number): ExampleStructure[] {
  if (count <= 0) {
    return [];
  }
  const data: ExampleStructure[] = [];
  while (count--) {
    data.push({
      id: count,
      name: `Test ${count}`,
      temperature: getRandomArbitrary(0, 50),
    });
  }

  return data.reverse();
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
