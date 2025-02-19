import React from 'react'

const Header = () => {
    return (
        <>
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "60px", WebkitBorderRadius: "30px", backgroundColor: "#18c645" }}>
                <label className="text-black" style={{ fontWeight: "bold", fontSize: "20px" }}>Todo App</label>
            </div>
        </>
    )
}

export default Header
