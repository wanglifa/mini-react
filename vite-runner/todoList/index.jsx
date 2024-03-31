import React from '../core/React.js'
const radios = [
  {
    label: 'all'
  },
  {
    label:'done'
  },
  {
    label: 'active'
  }
]
export const TodoList = () => {
  const [list, setList] = React.useState([])
  const [displayList, setDisplayList]= React.useState([])
  const [inputValue, setInputValue] = React.useState()
  const [checkedValue, setCheckedValue] = React.useState('all')
  const handleClickAdd = () => {
    setList((list) => [...list, {
      value: inputValue,
      status: 'active',
      id: crypto.randomUUID()
    }])
    setInputValue('')
  }
  const handleChange = (e) => {
    setInputValue(e.target.value)
  }
  const handleRemove = (id) => {
    const newList = list.filter(item => item.id !== id)
    setList(newList)
  }
  const handleSave = () => {
    localStorage.setItem('stageList', JSON.stringify(list))
  }
  const handleCancel = (id) => {

    const newList = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'active'
        }
      } else {
        return item
      }
    })
    setList(newList)
  }
  const handleDone = (id) => {
    const newList = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'done'
        }
      } else {
        return item
      }
    })
    setList(newList)
  }
  const handleRadioChange = (label) => {
    setCheckedValue(label)
  }
  React.useEffect(() => {
    const stateList = localStorage.getItem('stageList') 
    setList(stateList ? JSON.parse(stateList) : list)
  }, [])
  React.useEffect(() => {
    if (checkedValue === 'all') {
      setDisplayList(list)
    } else {
      const newList = list.filter(item => item.status === checkedValue)
      setDisplayList(newList)
    }
  }, [list, checkedValue])
  return (
    <div>
      <div>TODOS</div>
      <div>
        <input value={inputValue} onChange={handleChange}/>
        <button onClick={handleClickAdd}>add</button>
      </div>
      <button onClick={handleSave}>save</button>
      <div style={{display: 'flex'}}>
        {
          radios.map(radio => (
            <div key={radio.label}>
              <input 
                type='radio' 
                id={radio.label} 
                name='type' 
                value={radio.label} 
                checked={checkedValue === radio.label} 
                onChange={() => handleRadioChange(radio.label)}/>
              <label>{radio.label}</label>
            </div>
          )) 
        }
      </div>
      <ul>
        {
          displayList.map((item) => (
            <TodoItem 
              item={item}
              handleCancel={handleCancel}
              handleRemove={handleRemove}
              handleDone={handleDone}
            />
          ))
        }
      </ul>
    </div>
  )
}

const TodoItem = ({item, handleCancel, handleRemove, handleDone}) => {
  return (
    <li key={item.id} style={{display: 'flex'}}>
      <div className={item.status}>{item.value}</div>
      <button onClick={() => handleRemove(item.id)}>remove</button>
      {
        item.status === 'done' ? (
          <button onClick={() => handleCancel(item.id)}>cancel</button>
        ) : (
          <button onClick={() => handleDone(item.id)}>done</button>
        )
      }
    </li>
  )
}