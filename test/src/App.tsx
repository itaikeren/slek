import Calender from 'slek';

function App() {
  return (
        <Calender
          style={{
          width: 250
        }}>
          <Calender.Header>
            <Calender.Headline />
            <Calender.PrevButton />
            <Calender.NextButton />
          </Calender.Header>
          <Calender.Grid>
              {(props) => <span>{props.value}</span>}
          </Calender.Grid>
        </Calender>
  );
}

export default App
