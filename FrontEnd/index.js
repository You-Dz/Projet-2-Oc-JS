// Get DOM elements
const portfolio = document.querySelector("#portfolio");
const projects = portfolio.querySelector("h2")
const gallery = document.querySelector(".gallery");
const pageTitle = document.querySelector("header")

//Create DOM for Gallery in Edition mode
const projectsContainer = document.createElement("div")
projectsContainer.className = "projects-container"

const modifButton = document.createElement("button")
modifButton.type = "button"
modifButton.classList.add("modif-button","invisible","icon-button")

const iconProjects = document.createElement("i")
iconProjects.classList.add("fa-regular","fa-pen-to-square")

const modifText = document.createElement("span")
modifText.textContent = "modifier"

//Insert elements for editon mode
projectsContainer.appendChild(projects)
portfolio.prepend(projectsContainer)
projects.after(modifButton)
modifButton.appendChild(iconProjects)
modifButton.appendChild(modifText)

//Create DOM filter container & Insert 
const filterContainer = document.createElement("div")
filterContainer.classList.add("filter-container")
projectsContainer.after(filterContainer)

//Create DOM banner Edition mode
const editBanner = document.createElement("div")
editBanner.classList.add("edit-banner","invisible")

const iconBanner = document.createElement("i")
iconBanner.classList.add("fa-regular", "fa-pen-to-square")

const textBanner = document.createElement("p")
textBanner.textContent = "Mode édition"

//Insert DOM banner Edition mode
pageTitle.before(editBanner)
editBanner.appendChild(iconBanner)
editBanner.appendChild(textBanner)





// Base URL for all fetch method
const baseUrl = "http://localhost:5678/api/"

// fetch METHOD GET
async function getUrl (url) {
    console.log("URL appelée :", url) // 👈 DEBUG
    try {
        const response = await fetch(url)
        return await response.json()
    }
    catch (error) {
        console.log("Erreur lors de la récupération des données")
        return []
    }
}

// fetch METHOD DELETE
async function deleteUrl(url,id) {
    try {
        const token = JSON.parse(localStorage.getItem("token"))
        const response = await fetch(`${url}${Number(id)}`, {
            method : "DELETE",
            headers : {
            "Authorization" : `Bearer ${token}`
            }
        })
        return response.ok
    }
    catch (error) {
        console.log("Erreur lors de la suppression des données",error)
        return false
    } 
}

// fetch METHOD POST 
async function postUrl(url,data) {
    try {
        const token = JSON.parse(localStorage.getItem("token"))
        const response = await fetch(`${url}`, {
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            body : data
        })
        if (response.ok) {
            console.log("Données envoyées avec succès")
                return true
        } else {
            console.log("Erreur communication serveur", response.status)
            return false
        }
    }
    catch (error) {
        console.log("impossible de communiquer avec le serveur",error)
        return false
    }
}
// Get datas

//Categories
// let categories = [] en commentaire car plus utilisé en global
async function getCategories () {
    categories = JSON.parse(window.localStorage.getItem("categories"))//Ici le JSON.parse passe les données stockées en json
    if (categories === null) {
    categories  = await getUrl (`${baseUrl}categories`) 
    window.localStorage.setItem("categories", JSON.stringify(categories))
    }
    return categories
    // console.log(categories)
    }

// Projects 
// let works = []
async function getWorks () {
        works = JSON.parse(window.localStorage.getItem("works"))
    if(works === null){
        works = await getUrl(`${baseUrl}works`)
        window.localStorage.setItem("works", JSON.stringify(works))
    }
    return works
    // console.log(works)
}



//function create filterButtons
function createFilter (categories){ 
    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"
    buttonAll.id = "allCategories"
    filterContainer.appendChild(buttonAll)
    categories.forEach(category => {
        const buttonFilter = document.createElement("button")
        buttonFilter.innerText = category.name;
        filterContainer.appendChild(buttonFilter)
    })
}


//Function create gallery of works
function createGallery (works,container){
    container.innerHTML=""
    works.forEach(work => {
        const figure = document.createElement("figure")
        figure.dataset.id = work.id // On stock l'id du work en data id sur sa figure corespondante
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



//function filter behavior
let lastCategory = null // On déclare une variable qui n'a pas de valeur de base
function activFilter (works) {
    const buttonAll = document.getElementById("allCategories")
    buttonAll.addEventListener("click", () => {
        createGallery(works,gallery)
    })
    const buttonFilters = filterContainer.querySelectorAll("button")
    buttonFilters.forEach(buttonFilter => {
        buttonFilter.addEventListener("click", (event) => {
        const chosenCategory = event.target.textContent
        if (lastCategory === chosenCategory || chosenCategory === "Tous" ){
            createGallery(works,gallery)
            lastCategory = null // On réattribue la valeur de base à la variable 
        } else {
        const chosenWorks = works.filter(work => work.category.name === chosenCategory)
        createGallery(chosenWorks,gallery)
        lastCategory = chosenCategory // On attribut une nouvelle valeur à la variable
        }
        })
    })
}


// function token verification in index page
function checkToken (categories,works) {
    const token = localStorage.getItem("token")
    if (token){
        editBanner.classList.remove("invisible")
        const logLink = document.getElementById ("log-link")
        logLink.innerText = "logout"
        filterContainer.classList.add("invisible")
        projectsContainer.classList.add("projects-container-editor")
        modifButton.classList.remove("invisible")
        modifButton.addEventListener("click", ()=>{
            createModal(categories,works)
        })
    }
}

//LogOut behavior
const logLink = document.getElementById ("log-link")
logLink.addEventListener("click", ()=>{
    const token = localStorage.getItem("token")
    if (token) {
        localStorage.removeItem("token")
        editBanner.classList.add("invisible")
        projectsContainer.classList.remove("projects-container-editor")
        filterContainer.classList.remove("invisible")
        modifButton.classList.add("invisible")
        logLink.innerText = "login"
    } else{
        window.location.href ="login.html"
    }
})

 // function actualize storage from API
async function actualizeLocalStorage (key,fetchFunction) {
    localStorage.removeItem(key)
    const data = await fetchFunction()
    localStorage.setItem(key, JSON.stringify(data)) // Nom sous lequel les données sont stockée= key , valeur = JSON.stringify(data)
    return data
}


// Section MODAL Modal global then Modal gallery & Modal add photo

// function create modal global

function createModal(categories,works) {
    // Create background
    const modalBackground = document.createElement("div");
    modalBackground.classList.add("modal-background");
    editBanner.before(modalBackground);

    // create modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modalBackground.appendChild(modal);

    // create modal banner
    const modalBanner = document.createElement("div");
    modalBanner.classList.add("modal-banner");
    modal.appendChild(modalBanner);

    // create modal main content
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modal.appendChild(modalContent);

    // create back button
    const backButton = document.createElement("button");
    backButton.classList.add("back-button", "invisible", "icon-button");

    const backIcon = document.createElement("i");
    backIcon.classList.add("fa-solid", "fa-arrow-left");
    backButton.appendChild(backIcon);
    modalBanner.appendChild(backButton);

    // create close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button", "icon-button");

    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid", "fa-xmark");
    closeButton.appendChild(crossIcon);
    modalBanner.appendChild(closeButton);

    // close button behavior
    closeButton.addEventListener("click", () => {
        closeModal(modalBackground);
    });

    // backbutton behavior
    backButton.addEventListener("click", () => {
        modalIndex(modalContent,categories,works);
    });
    closeModalsOutsideClick(modalBackground)
    // Initialize modal content
    modalIndex(modalContent,categories,works);
}

// close functions part 
function closeModal (modalBackground) {
    modalBackground.classList.add("invisible");
}

function closeModalsOutsideClick (modalBackground){
    modalBackground.addEventListener("click", (event) => {
        if (event.target === modalBackground) {
            closeModal (modalBackground);
        }
    })
}


function modalIndex(modalContent, categories,works) {
    // empty content to refill
    modalContent.innerHTML = "";

    // hide back button
    const backButton = modalContent.parentElement.querySelector(".back-button");
    if (backButton) backButton.classList.add("invisible");

    // Create modal title
    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("modal-title");
    modalTitle.textContent = "Galerie Photo";

    // Create gallery container in modal
    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modal-gallery");

    // create addPhoto button
    const modalButton = document.createElement("button");
    modalButton.classList.add("modal-button");
    modalButton.textContent = "Ajouter une photo";

    // insert created elements
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalGallery);
    modalContent.appendChild(modalButton);

    // Create gallery in modal
    createGallery(works, modalGallery);

    // create delete button on each work part
    const figures = modalGallery.querySelectorAll("figure");
    figures.forEach((figure) => {
        figure.className = "modal-figure"; // remplacer la classe existante
        const id = figure.dataset.id // Récupération de l'id stocké lors de la creataion gallery

        // create delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can");

        //insert button
        deleteButton.appendChild(deleteIcon);
        figure.appendChild(deleteButton);

        deleteWork(figure, deleteButton, id, works, gallery)
    });

    // Index'buttons to next modal beahavior
    modalButton.addEventListener("click", () => {
        modalAddPhoto(modalContent, categories,works);
    });
}

// function delete with Delete button 
function deleteWork (figure, deleteButton, id, works, gallery) {
        // Delete button behavior

        deleteButton.addEventListener("click", async () => {
            const success = await deleteUrl(baseUrl+"works/",id)
            if (success) {
                figure.remove()
                works = await actualizeLocalStorage("works",getWorks) // "works" => nom de clé de stockage
                createGallery(works,gallery)
            }
        })
}


function modalAddPhoto(modalContent, categories, works) {
    // empty content to refill
    modalContent.innerHTML = "";

    // Show back button
    const backButton = modalContent.parentElement.querySelector(".back-button");
    if (backButton) backButton.classList.remove("invisible");

    //  Create modal title
    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("modal-title");
    modalTitle.textContent = "Ajout photo";
    modalContent.appendChild(modalTitle);

    // Create form
    const form = document.createElement("form");
    form.classList.add("modal-form");
    modalContent.appendChild(form);

    //Input photo + label

    //Container
    const inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")
    form.appendChild(inputContainer)

    //Preview
    const previewForm = document.createElement("img")
    previewForm.id = "preview"
    previewForm.alt = "Aperçu"
    previewForm.src= "./assets/icons/previewIcon.png"

    //create Input label 
    const labelPhoto = document.createElement("label");
    labelPhoto.htmlFor = "fileInput" // Lie l'input au label
    labelPhoto.classList.add("upload-button")
    labelPhoto.textContent = "+ Ajouter photo";

    // Create input photo
    const inputPhoto = document.createElement("input");
    inputPhoto.type = "file";
    inputPhoto.id = "fileInput";
    inputPhoto.classList.add("input-photo");
    inputPhoto.accept = "image/jpg, image/png"; 
    // Create info text
    const uploadInfo = document.createElement("p")
    uploadInfo.classList.add("upload-info")
    uploadInfo.textContent ="jpg, png : 4 mo max"

    // Insertion in DOM
    inputContainer.appendChild(previewForm);
    inputContainer.appendChild(labelPhoto);
    inputContainer.appendChild(inputPhoto);
    inputContainer.appendChild(uploadInfo)

    // Create Input titre + label
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.classList.add("input-title");

    const labelTitle = document.createElement("label");
    labelTitle.classList.add("label-title");
    labelTitle.textContent = "Titre";
    labelTitle.appendChild(inputTitle);
    form.appendChild(labelTitle);

    // Create Select catégories + label
    const selectCategories = document.createElement("select");
    selectCategories.classList.add("select-categories");

    const labelCategories = document.createElement("label");
    labelCategories.classList.add("label-categories")
    labelCategories.textContent = "Catégorie";

    //Select behavior
    //Default select option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Veuillez sélectionner une catégorie"
    defaultOption.selected = true;  
    defaultOption.disabled = true;
    selectCategories.appendChild(defaultOption)

    //Select options
    categories.forEach(category => {
        const option = document.createElement("option");
        option.classList.add("options");
        option.value = category.id // L'API attend l'id pas le name
        option.textContent = category.name;
        selectCategories.appendChild(option);
    });

    labelCategories.appendChild(selectCategories);
    form.appendChild(labelCategories);

    // Submit button
    const modalButton = document.createElement("button");
    modalButton.type = "submit"
    modalButton.classList.add("modal-button","modal-button-alt");
    modalButton.textContent = "Valider";
    form.appendChild(modalButton)

    // create Message error area
    const messageError = document.createElement("p")
    messageError.classList.add("message-error","invisible")
    messageError.textContent= ""
    form.after(messageError)

    // Call for functions
    previewUpload(previewForm,inputPhoto)
    submitAddPhoto(works,categories,form,inputPhoto,inputTitle,previewForm,selectCategories,modalContent)
}


//Error gestion part
function showMessageError (message){
    const messageError =document.querySelector(".message-error")
    messageError.classList.remove("invisible")
    messageError.textContent = message
}
function hideMessageError (){
    const messageError =document.querySelector(".message-error")
    messageError.classList.add("invisible")
    messageError.textContent = ""

}

// submit function with use Method POST
function submitAddPhoto (works,categories,form,inputPhoto,inputTitle,previewForm,selectCategories,modalContent) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formData = new FormData() // Ici on ne met rien en paramètre on déclare manuellement ce qu'on envoie ci-dessous sinon reprend chaque .name du form
        formData.append("image", inputPhoto.files[0]); // fichier
        formData.append("title", inputTitle.value.trim()); // texte
        formData.append("category", Number(selectCategories.value)); // id numérique
        const file = inputPhoto.files[0]
        if (!file) {
            showMessageError("Veuillez ajouter une image avant de valider")
            return
        }
        if (!checkFileSize(file, previewForm,inputPhoto)) {
            showMessageError("Attention le fichier sélectionné est supérieur à 4 mo")
            return
        }
        if (!inputTitle.value.trim()) {
            showMessageError("Veuillez donner un titre à votre photo" )
            console.log("erreur")
            return
        }
        if (!selectCategories.value) {
            showMessageError("Veuillez sélectionner une catégorie pour votre photo" )
            return         
        }
        for (let [key, value] of formData.entries()) {
    console.log(key, value);
}
        const success = await postUrl(baseUrl + "works/", formData)
        if (success) {
            console.log("Photo ajoutée!")
            works = await actualizeLocalStorage ("works", getWorks)
            createGallery(works, gallery);
            modalIndex(modalContent,categories,works)
        } else {
            showMessageError("Erreur lors de l'envoie au serveur")
        }
    })
}

// Select file gestion  : Preview & restriction photo

function previewUpload (previewForm,inputPhoto) {
    const uploadInfo = document.querySelector(".upload-info")
    inputPhoto.addEventListener("change", (event) => {
    const file = event.target.files[0] //  récupération fichier choisi => en tableau
    if (!file){
        previewForm.src= "./assets/icons/previewIcon.png"
        uploadInfo.textContent = "jpg,png : 4 mo max"
        return // return stop l'execution du reste de la fonction
        } 
    if (!checkFileSize(file, previewForm,inputPhoto)) {
        return
    } 
    const imageUrl = URL.createObjectURL(file) // on crée un url temporaire 
    previewForm.src = imageUrl // On attribue l'URL créé à l'image 
    })
}

// Function size restriction
function checkFileSize (file, previewForm,inputPhoto) {
    const maxSize = 4 * 1024 * 1024
    const uploadInfo = document.querySelector(".upload-info")
    if (file.size > maxSize) {
        inputPhoto.value = ""
        uploadInfo.textContent = "Attention le fichier sélectionné est supérieur à 4 mo"
        previewForm.src = "./assets/icons/previewIcon.png"
        return false
    } 
    return true
}

//Launcher
async function init() {
    const categories = await getCategories()
    const works = await getWorks()
    createFilter(categories)
    createGallery(works,gallery)
    activFilter(works)
    checkToken(categories,works)
}
init()