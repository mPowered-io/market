import React, { ReactElement, useState, ChangeEvent, FormEvent } from 'react'
import { useField } from 'formik'
import { InputProps } from '@shared/FormInput'
import InputElement from '@shared/FormInput/InputElement'
import styles from './index.module.css'
import Button from '@shared/atoms/Button'

// https://www.cluemediator.com/add-or-remove-input-fields-dynamically-with-reactjs
export default function Parameters(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [paramaterList, setParameterList] = useState([])

  const [dirtyName, setDirtyName] = useState([])
  const [dirtyType, setDirtyType] = useState([])
  const [dirtyOption, setDirtyOption] = useState([])

  const handleTypeChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const list = [...paramaterList]

      list[index].type = value

      if (dirtyType.indexOf(index) === -1) {
        setDirtyType([...dirtyType, index])
      }

      if (value !== 'select') {
        delete list[index].options
        setDirtyOption([])
      } else {
        list[index].options = [{ '': '' }]
      }

      setParameterList(list)
      helpers.setValue(list)
    }

  const handleNameChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const list = [...paramaterList]

      list[index][name] = value

      setParameterList(list)
      helpers.setValue(list)
    }

  const handleInputChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const list = [...paramaterList]

      list[index][name] = value

      setParameterList(list)
      helpers.setValue(list)
    }

  const handleCheckboxChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target
      const list = [...paramaterList]

      list[index][name] = checked
      setParameterList(list)
      helpers.setValue(list)
    }

  const handleOptionNameChange =
    (paramIndex: number, optionIndex: number) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const list = [...paramaterList]

      list[paramIndex].options[optionIndex][value] = Object.values(
        list[paramIndex].options[optionIndex]
      )[0]
      delete list[paramIndex].options[optionIndex][
        Object.keys(list[paramIndex].options[optionIndex])[0]
      ]

      setParameterList(list)
      helpers.setValue(list)

      if (dirtyOption.indexOf(optionIndex) === -1) {
        setDirtyOption([...dirtyOption, optionIndex])
      }
    }

  const handleOptionValueChange =
    (paramIndex: number, optionIndex: number) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const list = [...paramaterList]

      Object.keys(list[paramIndex].options[optionIndex]).map((key) => {
        list[paramIndex].options[optionIndex][key] = value
      })

      setParameterList(list)
      helpers.setValue(list)
    }

  const handleAddOptionClick =
    (paramIndex: number, optionIndex: number) =>
    (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const list = [...paramaterList]

      if (dirtyOption.indexOf(optionIndex) === -1) {
        setDirtyOption([...dirtyOption, optionIndex])
      }

      // check if any keys are blank
      let oneKeyBlank = false
      for (let i = 0; i < list[paramIndex].options.length; i++) {
        if (Object.keys(list[paramIndex].options[i])[0] === '') {
          oneKeyBlank = true
          break
        }
      }

      if (!oneKeyBlank) {
        list[paramIndex].options = [...list[paramIndex].options, { '': '' }]

        setParameterList(list)
        helpers.setValue(list)
      }
    }

  const handleRemoveOptionClick =
    (paramIndex: number, optionIndex: number) =>
    (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const list = [...paramaterList]
      let dirtyO = dirtyOption

      list[paramIndex].options.splice(optionIndex, 1)
      setParameterList(list)
      helpers.setValue(list)

      dirtyO = dirtyO.map((n) => {
        if (n < optionIndex) return n
        if (n === optionIndex) return
        if (n > optionIndex) return n - 1
      })
      setDirtyOption(dirtyO)
    }

  const handleAddParameterClick =
    (index: number) => (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const defaultParams = {
        type: '',
        name: '',
        label: '',
        description: '',
        required: false,
        default: '',
        options: [{ '': '' }]
      }
      let oneKeyBlank = false

      if (index === -1) {
        setParameterList([...paramaterList, defaultParams])
        return
      }

      if (dirtyName.indexOf(index) === -1) {
        setDirtyName([...dirtyName, index])
      }
      if (dirtyType.indexOf(index) === -1) {
        setDirtyType([...dirtyType, index])
      }

      // validate this set of parameters
      if (paramaterList[index].type === 'select') {
        for (let i = 0; i < paramaterList[index].options.length; i++) {
          if (Object.keys(paramaterList[index].options[i])[0] === '') {
            oneKeyBlank = true
            if (dirtyOption.indexOf(i) === -1) {
              setDirtyOption([...dirtyOption, i])
            }
          }
        }
      }
      if (
        paramaterList[index].name !== '' &&
        paramaterList[index].type !== '' &&
        !oneKeyBlank
      ) {
        setParameterList([...paramaterList, defaultParams])
      }
    }

  const handleRemoveParameterClick =
    (index: number) => (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const list = [...paramaterList]
      let dirtyN = dirtyName
      let dirtyT = dirtyType

      list.splice(index, 1)
      setParameterList(list)
      helpers.setValue(list)

      dirtyN = dirtyN.map((n) => {
        if (n < index) return n
        if (n === index) return
        if (n > index) return n - 1
      })
      setDirtyName(dirtyN)

      dirtyT = dirtyT.map((n) => {
        if (n < index) return n
        if (n === index) return
        if (n > index) return n - 1
      })
      setDirtyType(dirtyT)
    }

  return (
    <div className={styles.parameters}>
      {paramaterList.map((x: string, i: number) => {
        return (
          <div key={i} className={styles.parameter}>
            <div
              className={`${styles.field} ${
                dirtyType.indexOf(i) > -1 && x.type === ''
                  ? styles.hasError
                  : ''
              }`}
            >
              <label className={styles.label}>Type *:</label>
              <InputElement
                type="select"
                name="type"
                value={x.type}
                options={['', 'text', 'select']}
                onChange={handleTypeChange(i)}
                className={styles.select}
              />
            </div>

            <div
              className={`${styles.field} ${
                dirtyName.indexOf(i) > -1 && x.name === ''
                  ? styles.hasError
                  : ''
              }`}
            >
              <label className={styles.label}>Name *:</label>
              <InputElement
                type="text"
                name="name"
                value={x.name}
                placeholder="e.g. fname"
                onChange={handleNameChange(i)}
                className={styles.input}
              />
            </div>

            {paramaterList[i].type === 'select' && (
              <div className={styles.field}>
                <label className={styles.label}>Options *:</label>
                <div className={styles.options}>
                  {paramaterList[i].options.map((y: string, j: number) => {
                    return (
                      <div
                        key={j}
                        className={`${
                          dirtyOption.indexOf(j) > -1 &&
                          Object.keys(y)[0] === ''
                            ? styles.hasError
                            : ''
                        }`}
                      >
                        <InputElement
                          type="text"
                          name="name"
                          value={Object.keys(y)[0]}
                          placeholder="key"
                          onChange={handleOptionNameChange(i, j)}
                          className={styles.option}
                        />
                        <InputElement
                          type="text"
                          name="value"
                          value={Object.values(y)[0]}
                          placeholder="value"
                          onChange={handleOptionValueChange(i, j)}
                          className={styles.option}
                        />
                        <div>
                          {paramaterList[i].options.length !== 1 && (
                            <Button
                              style="primary"
                              onClick={handleRemoveOptionClick(i, j)}
                              className={styles.button}
                            >
                              Remove
                            </Button>
                          )}
                          {paramaterList[i].options.length - 1 === j && (
                            <Button
                              style="primary"
                              onClick={handleAddOptionClick(i, j)}
                              className={styles.button}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Label:</label>
              <InputElement
                type="text"
                name="label"
                value={x.label}
                placeholder="e.g. First Name"
                onChange={handleInputChange(i)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description:</label>
              <InputElement
                type="text"
                name="description"
                value={x.description}
                placeholder="e.g. Enter your first name"
                onChange={handleInputChange(i)}
                className={styles.input}
              />
            </div>
            <div className={styles.requiredfield}>
              <InputElement
                type="checkbox"
                name="required"
                checked={x.required}
                options={['Required?']}
                onChange={handleCheckboxChange(i)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Default:</label>
              <InputElement
                type="text"
                name="default"
                value={x.default}
                placeholder="e.g. John"
                onChange={handleInputChange(i)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <Button
                style="primary"
                onClick={handleRemoveParameterClick(i)}
                className={styles.button}
              >
                Remove
              </Button>
              {paramaterList.length - 1 === i && (
                <Button
                  style="primary"
                  onClick={handleAddParameterClick(i)}
                  className={styles.button}
                >
                  Add
                </Button>
              )}
              <span />
            </div>
          </div>
        )
      })}
      {paramaterList.length === 0 && (
        <Button
          style="primary"
          onClick={handleAddParameterClick(-1)}
          className={styles.button}
        >
          Add
        </Button>
      )}
      <span />
    </div>
  )
}
