import "./Table.css"
import React from 'react'
import numeral from "numeral"

function Table({countries}) {
    return (
        <div className="table">
            {countries && countries.map(({country, cases}) => (
                <ul>
                    <li>{country}</li>
                    <li><strong>{numeral(cases).format("0,0")}</strong></li>
                </ul>
            ))}
        </div>
    )
}

export default Table
