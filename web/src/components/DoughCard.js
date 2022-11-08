import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const DoughInputGroup = ({ingredients,handleChange,value,width}) => {
    return (
        <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
        {ingredients[1].map(ingredient => {return (
        <ToggleButton  key={`${ingredient.ingredient_id}_${ingredient.ingredient_name}_${ingredient.ingredient_type}`} id={`tbg-btn-${ingredient.ingredient_id}`} value={ingredient.ingredient_id} >
            {ingredient.ingredient_name}
        </ToggleButton>)})}
        </ToggleButtonGroup>

    )
}

const DoughCard = ({ingredients_by_type, value, handleChange}) => {
    return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dough Type</h5>
            <div className="card-text container w-auto">
                {ingredients_by_type ?
                <DoughInputGroup ingredients={['Dough',ingredients_by_type['Dough']]} value={value} handleChange={handleChange}/>
                :
                <p>Not loaded</p>
                }
            
            </div>     
          </div>
          </div>
    );
}

export default DoughCard;