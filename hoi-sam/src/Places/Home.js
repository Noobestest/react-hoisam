
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import WheelComponent from 'react-wheel-of-prizes'


function Home() {
  const [spinnerPlaces, setSpinnerPlaces] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [places, setPlaces] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getPlaces();
    if (isLoading) {
      setLoading(false);
    }
  }, [isLoading])
  
  
  const getPlaces = () => {
    axios.get("https://onele9.com/api/getPlaces").then(response => {
      if(response != null && response.data.length > 0){
        var details = response.data.map(i => i.text);
        setTableList(response.data);
        setSpinnerPlaces([...details]);
      }
    })
  }

  const createPlace = (payload) => {
    axios.post("https://onele9.com/api/createPlaces", payload).then(response => {
      setSpinnerPlaces([]);
      setLoading(true);
    })
  }


  const handleClick = () => {
    var payload = {
      text: places
    }
    createPlace(payload)
    setLoading(true)
  };

  const handleDelete = id => {
    axios.delete(`https://onele9.com/api/deletePlaces/${id}`).then(response => {
      setSpinnerPlaces([]);
      setLoading(true);
    })
  }
  
  const segColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000',
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000',
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000',
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000'
  ]
  const onFinished = (winner) => {
    console.log(winner)
  }
  
  return (
    <div>
      <div className="col-12">
        <div className="col-6">
          <div  onClick={() => {window.location.href="/guess"}}>
            <h1>
              Roulette Where to Eat
            </h1>
          </div>
        </div>
        <div className="col-6">
          
        </div>
      
      </div>
      
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Places"
          aria-label="Places"
          aria-describedby="basic-addon2"
          onChange={(e) => {setPlaces(e.target.value)}}
        />
        <InputGroup.Text id="basic-addon2">
          <Button
                variant="primary"
                disabled={isLoading}
                onClick={!isLoading ? handleClick : null}
              >
                {isLoading ? 'Loading…' : 'Only Add'}
            </Button>
        </InputGroup.Text>
      </InputGroup>
      {!isLoading && spinnerPlaces.length > 0 && (
        <div className="col-12 d-md-flex">
          <div className="col-md-9 col-12">
            <WheelComponent
              segments={spinnerPlaces}
              segColors={segColors}
              onFinished={(winner) => onFinished(winner)}
              primaryColor='green'
              contrastColor='white'
              buttonText='Spin'
              isOnlyOnce={false}
              size={290}
              upDuration={100}
              downDuration={1000}
              fontFamily='Arial'
            />
          </div>
          <div className="col-md-3 col-12">
            <table  className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>{'Meow Chung As Me Do One'}</th>
                  <th>{'Delete Function'}</th>
                </tr>
              </thead>
              <tbody>
                {tableList.map((item) => {
                  return (
                  <tr>
                    <td>{item.text}</td>
                    <td>
                      <Button
                          variant="danger"
                          disabled={isLoading}
                          onClick={() => {handleDelete(item.id)}}
                        >
                          {isLoading ? 'Loading…' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                  )
                })}          
              </tbody>
              <tr></tr>
            </table>
          </div>
        </div>
        
      )}
    </div>
  );
}

export default Home;
