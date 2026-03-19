    // Fonction Création du DOM
function creation (tag, className, content){
    const element = document.createElement(tag)
    if (className) element.classList.add(...className.split(" "))
    //Ici classList.add est une fonction on ne peut faire "=" car cela ecrase la fonction
    //"split" crée un tableau (liste) de classe ["x","y" etc.] "..." passe chaque elmt dans "add"
    // ATTENTION espace entre les "" dans split (permet la séparation des class)
    if (content) element.textContent = content
    return element
}
const portfolio = document.querySelector("#portfolio");
const projects = portfolio.querySelector("h2")
const gallery = document.querySelector(".gallery");
//création contenu mode edition
const projectsContainer = creation("div","projects-container")
projectsContainer.appendChild(projects)
portfolio.prepend(projectsContainer)
const modifButton = creation("button","modif-button invisible icon-button")
modifButton.type = "button"
projects.after(modifButton)
const iconProjects = creation("i","fa-regular fa-pen-to-square")
modifButton.appendChild(iconProjects)
const modifText = creation("span",null,"modifier")
modifButton.appendChild(modifText)
// Creéation conteneur filtres
const filterContainer =creation("div","filter-container")
projectsContainer.after(filterContainer) // Ajoute la nouvelle div après le conteneur sup
//Création bannière Edition
const editBanner = creation("div","edit-banner invisible")
const pageTtile = document.querySelector("header")
pageTtile.before(editBanner)
const iconBanner = creation("i","fa-regular fa-pen-to-square")
const textBanner = creation("p",null,"Mode édition")
editBanner.appendChild(iconBanner)
editBanner.appendChild(textBanner)
pageTtile.classList.add("edit-option")

// Récupération des catégories dans l'api + création des boutons de filtres
let categories = []
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    console.log(categories)   
    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"
    buttonAll.id = "allCategories"
    filterContainer.appendChild(buttonAll)
    categories.forEach(category => {
        const buttonFilter = document.createElement("button")
        buttonFilter.innerText = category.name;
        filterContainer.appendChild(buttonFilter)
    }) 
    return categories
}

// getCategories()
let works = []
// Récupération des works(images) dans l'api + création de la grille en dynamique
async function getWorks() {
    works = JSON.parse(window.localStorage.getItem("works"))//Ici le JSON.parse passe les données stockées en json
    if(works === null){
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();
        afficherWorks(works,gallery)
        window.localStorage.setItem("works", JSON.stringify(works))// Ici on stock les données en les mettant en STRING
    }
    console.log(works)
    afficherWorks(works,gallery)
}
// getWorks()

function afficherWorks (works,container) {
    container.innerHTML=""
    works.forEach(work => {
        const figure = document.createElement("figure")
        const image = document.createElement("img")
        container.appendChild(figure)
        figure.appendChild(image)
        image.src = work.imageUrl
        image.alt = work.title
        if (container === gallery){
            const figCaption = document.createElement("figcaption")
            image.after(figCaption)
            figCaption.innerText = work.title
        }
    })
}
let lastCategory = null // On déclare une variable qui n'a pas de valeur de base
function categoriesFilter () {
    const buttonAll = document.getElementById("allCategories")
    buttonAll.addEventListener("click", () => {
        afficherWorks(works,gallery)
    })
    const buttonFilters = filterContainer.querySelectorAll("button")
    buttonFilters.forEach(buttonFilter => {
        buttonFilter.addEventListener("click", (event) => {
        const chosenCategory = event.target.textContent
        if (lastCategory === chosenCategory || chosenCategory === "Tous" ){
            afficherWorks(works,gallery)
            lastCategory = null // On réattribue la valeur de base à la variable 
        } else {
        const chosenWorks = works.filter(work => work.category.name === chosenCategory)
        afficherWorks(chosenWorks,gallery)
        lastCategory = chosenCategory // On attribut une nouvelle valeur à la variable
        }
        })
    })
}
async function init() {
    await Promise.all ([getCategories(),getWorks()]) // on attend (2 promesse) que les deux fonction aient eu lieux pour poursuivre
    // categories = await getCategories() // Les cat sont placées dans la variables et donc réutilisables
    // await getWorks()
    categoriesFilter()
    checkToken()
}
init() 

// Vérification du token qui induit les changement dans le dom 
function checkToken () {
    const token = localStorage.getItem("token")
    if (token){
        editBanner.classList.remove("invisible")
        const logLink = document.getElementById ("log-link")
        logLink.innerText = "logout"
        // const filterContainer = document.querySelector(".filter-container")
        filterContainer.classList.add("invisible")
        modifButton.classList.remove("invisible")
        modifButton.addEventListener("click", ()=>{
            createModal(categories)
        })
    }
}
//Dynamique du logout
const logLink = document.getElementById ("log-link")
logLink.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    editBanner.classList.add("invisible")
    logLink.innerText = "login"
    filterContainer.classList.remove("invisible")
    modifButton.classList.add("invisible")
})

// Fonction creation modal
function createModal (categories) {
    const modalBackground = creation("div","modal-background")
    editBanner.before(modalBackground)
    const modal = creation("div", "modal")
    modalBackground.appendChild(modal)
    const modalBanner = creation("div", "modal-banner")
    modal.appendChild(modalBanner)
    const modalContent = creation("div","modal-content")
    modal.appendChild(modalContent)
    const back = creation("i","fa-solid fa-arrow-left")
    const backButton = creation("button","back-button invisible icon-button")
    backButton.appendChild(back)
    modalBanner.appendChild(backButton)
    const cross = creation("i","fa-solid fa-xmark")
    const closeButton = creation("button","close-button icon-button")
    closeButton.appendChild(cross)
    modalBanner.appendChild(closeButton)
    closeButton.addEventListener("click", () => {
        modalBackground.classList.add("invisible")
    })
    backButton.addEventListener("click", ()=>{
        modalIndex(modalContent,categories)
    })
    // modalAddPhoto(modalContent,categories)
    modalIndex(modalContent,categories)
}

function modalIndex (modalContent, categories) {
    modalContent.innerHTML=""
    const backButton = modalContent.parentElement.querySelector(".back-button")//si plusieurs back button par la suite on cible son conteneur
    backButton.classList.add("invisible")
    const modalTitle = creation("h2","modal-title","Galerie Photo")
    const modalGallery = creation("div","modal-gallery")
    const modalButton = creation("button","modal-button","Ajouter une photo")
    modalContent.appendChild(modalTitle)
    modalContent.appendChild(modalGallery)
    modalContent.appendChild(modalButton)
    afficherWorks(works,modalGallery)
    const figures = modalGallery.querySelectorAll("figure")
    figures.forEach(figure => {
        const deleteButton = creation("button","delete-button")
        const deleteIcon = creation("i","fa-solid fa-trash-can")
        figure.className = "modal-figure"
        deleteButton.appendChild(deleteIcon)
        figure.appendChild(deleteButton)
    })
    modalButton.addEventListener("click", ()=> {
        modalAddPhoto(modalContent,categories)
    })
}
function modalAddPhoto (modalContent, categories) {
    modalContent.innerHTML = ""
    const backButton = modalContent.parentElement.querySelector(".back-button")
    backButton.classList.remove("invisible")
    const modalTitle = creation("h2","modal-title","Ajout photo")
    modalContent.appendChild(modalTitle)
    const form = creation ("form","modal-form")
    modalContent.appendChild(form)
    const inputPhoto = creation("input", "input-photo")
    inputPhoto.type = "file"
    const labelPhoto = creation("label","", "+ Ajouter photo")
    labelPhoto.appendChild(inputPhoto)
    form.appendChild(labelPhoto)
    const inputTitle = creation("input", "input-title")
    const labelTitle = creation("label", "label-title", "Titre")
    inputTitle.type = "text"
    labelTitle.appendChild(inputTitle)
    form.appendChild(labelTitle)
    const selectCategories = creation("select", "select-categories")
    const labelCategory = creation("label", "", "Catégorie")
    
    categories.forEach(category => {
        const option = creation("option","options")
        option.textContent = category.name
        selectCategories.appendChild(option)
    })
    labelCategory.appendChild(selectCategories)
    form.appendChild(labelCategory)

}