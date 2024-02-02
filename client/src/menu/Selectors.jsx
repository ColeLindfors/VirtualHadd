
import React from 'react';
import './Selectors.css';

// TODO: fix the all_liquors css to be centered in the button
function Selectors({variety, liquor, handleVarietyChange, handleLiquorChange, liquorOptions, varietyOptions}) {

    return(
        <div className='menu-selectors'>
            <div className={`selector-wrapper ${variety !== 'all_varieties' ? 'selected' : ''}`} >
                <select 
                    className='dynamic-selector'
                    onChange={handleVarietyChange}
                >
                    <option key="all_varieties" value="all_varieties" >All Varieties</option>
                    {varietyOptions.map((varietyOption) => 
                        <option key={varietyOption} value={varietyOption}>
                            {varietyOption.charAt(0).toUpperCase() + varietyOption.slice(1)}
                        </option>
                    )}
                </select>
            </div>
            <div className={`selector-wrapper ${liquor !== 'all_liquors' ? 'selected' : ''}`}>
                <select 
                    className='dynamic-selector'
                    onChange={handleLiquorChange}
                >
                    <option key="all_liquors" value="all_liquors">All Liquors</option> 
                    {liquorOptions.map((liquorOption) => 
                        <option key={liquorOption} value={liquorOption}>
                            {liquorOption.charAt(0).toUpperCase() + liquorOption.slice(1)}
                        </option>
                    )}
                </select>
            </div>
        </div>
    )
}

export default Selectors;
