const Header = ({ courseName }: { courseName: string }): JSX.Element => (
  <h1>Hello, {courseName}</h1>
);

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CourseDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBase, CourseDescription {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartBase, CourseDescription {
  backgroundMaterial: string;
  kind: 'background';
}

interface CoursePartRequirement extends CoursePartBase, CourseDescrtiption {
  requirements: string[];
  kind: 'special';
}

type CoursePart =
  | CourseDescription
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartRequirement;

const Part = ({ courseParts }: { courseParts: CoursePart[] }): JSX.Element => {
  return (
    <div>
      {courseParts.map((part) => {
        switch (part.kind) {
          case 'basic':
            //console.log(part.name, part.description, part.exerciseCount);
            return (
              <div key={part.name}>
                <b>
                  {part.name} {part.exerciseCount}
                </b>
                <br />
                <i>{part.description}</i>
                <pre />
              </div>
            );
            break;
          case 'group':
            return (
              <div key={part.name}>
                <b>
                  {part.name} {part.exerciseCount}
                </b>
                <br />
                project exercises {part.groupProjectCount}
                <pre />
              </div>
            );
            break;
          case 'background':
            return (
              <div key={part.name}>
                <b>
                  {part.name} {part.exerciseCount}
                </b>
                <br />
                <i>{part.description}</i>
                <br /> submit to {part.backgroundMaterial}
                <pre />
              </div>
            );
            break;
          case 'special':
            return (
              <div key={part.name}>
                <b>
                  {part.name} {part.exerciseCount}
                </b>
                <br />
                <i>{part.description}</i>
                <br />
                {console.log(part.requirements)}
                required skills: {part.requirements.join(', ')}
              </div>
            );
        }
      })}
    </div>
  );
};

const Content = ({
  courseParts,
}: {
  courseParts: CoursePart[];
}): JSX.Element => {
  return (
    <div>
      <Part courseParts={courseParts} />
      {/* {courseParts.map((course) => (
        <p key={course.name}>
          {course.name} {course.exerciseCount}
        </p>
      ))} */}
    </div>
  );
};

const Total = ({ courseParts }: { courseParts: CoursePart[] }): JSX.Element => {
  return (
    <div>
      <p>
        Number of exercises{' '}
        {courseParts.reduce((sum, part) => sum + part.exerciseCount, 0)}
      </p>
    </div>
  );
};

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
      {/* <p>Number of exercises {totalExercises}</p> */}
    </div>
  );
};

export default App;
