import React from "react"


type CategoriesProps = {
    value: number
    onChangeCategory: (index: number) => void
}

const Categories: React.FC<CategoriesProps> = ({value, onChangeCategory}) => {
    const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые']

    return (
        <div className="categories">
            <ul>
                {categories.map((category, index) => {
                    return (
                        <li key={index} onClick={() => onChangeCategory(index)}
                            className={value === index ? "active" : undefined}
                        >
                            {category}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default Categories