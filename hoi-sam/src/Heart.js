
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './heart.scss';
import { Button, Form, Table} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import WheelComponent from 'react-wheel-of-prizes'


function Heart() {
  const fillCount = useRef(0);
  const [text, setText] = useState('Hi');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    var bannerDetails = document.getElementById('banner')
    
    if(bannerDetails != null){
      bannerDetails.style.setProperty('--bg', '0px');
    }

    if (isLoading) {
      setLoading(false);
    }
  }, [isLoading])


  const handleClick = () => {
    if(fillCount.current > 600){
      var elementId = document.getElementById('banner-parent');
      elementId.removeChild(elementId.firstElementChild);

      const node = document.createElement("div");
      node.setAttribute("id", "heart");
      elementId.appendChild(node);

    } else{

      handleText();
      fillCount.current += 40;
      var stylesDetails = document.getElementById('banner-color');
  
      stylesDetails.style.animation = 'none';
      window.requestAnimationFrame(function(){
        stylesDetails.style.animation = 'wipe 1s cubic-bezier(.2,.6,.8,.4) forwards';
        stylesDetails.style.setProperty('--bg', `${fillCount.current}px`)
      });
    }
  };

  const handleText = () => {
    console.log(fillCount.current)
    if(fillCount.current < 120){
      setText("Hi")
    } else if (fillCount.current < 200){
      setText("Hang In There")
    } else if (fillCount.current < 280){
      setText("Close To Halfway")
    }  else if (fillCount.current < 400){
      setText("Oops lost count more than halfway")
    }  else if (fillCount.current < 480){
      setText("Think so you are close")
    }  else if (fillCount.current < 600){
      setText("Ok i actually lost count. Just try a couple more clicks")
    }
  }
  
  
  return (
    <div className='hearts-page'>
      <div className="col-12 mt-2" style={{textAlign: 'center'}}>
        <Button
          variant="danger"
          disabled={isLoading}
          onClick={() => {window.location.href="/"}}
        >
          {isLoading ? 'Loading…' : 'Go Back'}
      </Button>
      </div>
      {/* <div className="col-12" style={{textAlign: 'center'}}>
        <input id="toggle-heart" type="checkbox"/>
        <label htmlFor="toggle-heart">❤</label>
      </div> */}
      <div id="banner-parent" className="col-12 mt-5">
        <div id="banner" onClick={() => {handleClick()}}>
            <div id= "banner-color"  onClick={() => {handleClick()}}>
              <div>{text}</div>
            </div>
             <div className="text-center">Click Me</div>
        </div>
      </div>
    </div>
  );
}

export default Heart;
