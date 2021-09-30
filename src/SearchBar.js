import {TextField} from "@material-ui/core"
import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'

function SearchBar(props) {
    const countryNames = props.countries.map(country => country.name)
    const changeHandler = (event, value) => {
    const country = props.countries.find(country => country.name === value)
        country !== undefined && props.onInputChange(country.value)
    }
    return (
        <Autocomplete
            id="search-bar"
            options={countryNames}
            style={{width: 350}}
            renderInput={(params) => <TextField variant="outlined" {...params} label="Search by Country" />}
            autoHighlight
            onChange={changeHandler}
        />
    )
}

export default SearchBar
