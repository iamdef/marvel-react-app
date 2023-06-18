import spiner from '../../resources/img/spinner.gif';
import './spinner.scss';

const Spinner = (props) => {
    const position = props.position ? props.position : null;
    return (
        <img className='spinner' src={spiner} alt="loading" style={{position: position}}/>
    )
}

export default Spinner;