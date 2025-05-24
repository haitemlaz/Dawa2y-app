function StartMenu({SetPage}) {
    return (
        <div className="start-menu">
            <div onClick={()=>SetPage("patient")}>
                Prescription
            </div>
            <div>
                Analysis
            </div>

            
        </div>
    )
}

export default StartMenu
