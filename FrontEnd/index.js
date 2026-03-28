(() => {

    
    
    // Base URL for all fetch method
    const baseUrl = "http://localhost:5678/api/"
    
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
    
    
    
    
    
    
    
    /**
 * Get datas from api via fetch
 * @param {string} url - full Url of the API
 * @returns {promise<any[]>}
    */
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


/**
 * Delete data in API via fetch
 * @param {string} url - url of the API must include path before ID
 * @param {number} id - ID of the data to delete
 * @returns {promise<boolean>}
*/
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


/**
 *  Send datas to the API via fetch
 * @param {string} url - full URL of API 
 * @param {formData|Object} data - Datas you want to send to the API
 * @returns {promise<boolean>}
*/
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

//Categoriesdire en commentaire ce que ça fait vraiement entre storage et fetch (fallback)

/**
 * Get the categories from the API via fetch
 * @returns {Promise<any[]>}
 */
async function getCategories () {
    
    //Ici le JSON.parse passe les données stockées en json
    let categories = JSON.parse(window.localStorage.getItem("categories"))
    if (categories === null) {
        categories  = await getUrl (`${baseUrl}categories`) 
        window.localStorage.setItem("categories", JSON.stringify(categories))
    }
    // console.log(categories)
    return categories
}

// Projects 

/**
 * Get the works from the API via fetch
 * @returns {Promise<any[]>}
 */
async function getWorks () {
    let works = JSON.parse(window.localStorage.getItem("works"))
    if(works === null){
        works = await getUrl(`${baseUrl}works`)
        window.localStorage.setItem("works", JSON.stringify(works))
    }
    // console.log(works)
    return works
}


/**
 * Create button to filter works in gallery
 * @param {Array} categories - List of categories
 */
function createFilterByCategories (categories){ 
    const buttonAll = document.createElement("button")
          buttonAll.innerText = "Tous"
          buttonAll.id = "button-all"
          buttonAll.dataset.id = "allCategories"
          filterContainer.appendChild(buttonAll)
    categories.forEach(category => {
        const buttonFilter = document.createElement("button")
              buttonFilter.innerText = category.name;
              buttonFilter.dataset.id = category.id;
              filterContainer.appendChild(buttonFilter)
    })
}

/**
 * Create the gallery with the works 
 * @param {Array} works - List of works
 * @param {HTMLElement} container - Container to insert the gallery
 */
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



/**
 * Behavior of the filter button
 * @param {Array} works - List of works
 */
let lastCategory = null // On déclare une variable qui n'a pas de valeur de base
function activFilter (works) {
    const buttonFilters = filterContainer.querySelectorAll("button")
    buttonFilters.forEach(buttonFilter => {
        buttonFilter.addEventListener("click", (event) => {
            const chosenCategory = event.target.dataset.id
            if (lastCategory === chosenCategory || chosenCategory === "allCategories"){
            createGallery(works,gallery)
            lastCategory = null // On réattribue la valeur de base à la variable 
            return
        } else {
            const chosenWorks = works.filter(work => work.category.id === Number(chosenCategory))
            createGallery(chosenWorks,gallery)
            lastCategory = chosenCategory // On attribut une nouvelle valeur à la variable
        }
        })
    })
}

/**
 * Verify the presence of the token in local storage to be logIn or LogOut
 * @param {Array} categories - List of categories
 * @param {Array} works - List of works
 */
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

/**
 * Actualize the local storage via fetch 
 * @param {string} key - Key name for localStorage
 * @param {Function} fetchFunction - Function to fetch data from API
 * @returns {Promise<any[]>}
 */
async function actualizeLocalStorage (key,fetchFunction) {
    localStorage.removeItem(key)
    const data = await fetchFunction()
    localStorage.setItem(key, JSON.stringify(data)) // Nom sous lequel les données sont stockée= key , valeur = JSON.stringify(data)
    return data
}


// Section MODAL Modal global then Modal gallery & Modal add photo

/**
 * Create the squeletton of modals
 * @param {Array} categories - List of categories
 * @param {Array} works - List of works
 */
function createModal(categories,works) {

    const backIcon = document.createElement("i");
          backIcon.classList.add("fa-solid", "fa-arrow-left");
    
    const crossIcon = document.createElement("i");
          crossIcon.classList.add("fa-solid", "fa-xmark");

    // create back button
    const backButton = document.createElement("button");
          backButton.classList.add("back-button", "invisible", "icon-button");
          backButton.appendChild(backIcon);
          // backbutton behavior
          backButton.addEventListener("click", () => modalIndex(modalContent,categories,works,modalBackground));
    
    // create close button
    const closeButton = document.createElement("button");
          closeButton.classList.add("close-button", "icon-button");
          closeButton.appendChild(crossIcon);
          // close button behavior
          closeButton.addEventListener("click", () => closeModal(modalBackground));

    
    // create modal header
    const modalHeader = document.createElement("div");
          modalHeader.classList.add("modal-header");
          modalHeader.appendChild(backButton);
          modalHeader.appendChild(closeButton);
          
    
    // create modal main content
    const modalContent = document.createElement("div");
          modalContent.classList.add("modal-content");
    
    // create modal container
    const modal = document.createElement("div");
          modal.classList.add("modal");
          modal.appendChild(modalHeader);
          modal.appendChild(modalContent);
    
    // Create background
    const modalBackground = document.createElement("div");
          modalBackground.classList.add("modal-background");
          editBanner.before(modalBackground);
          modalBackground.appendChild(modal);
    
    
    closeModalsOutsideClick(modalBackground)
    // Initialize modal content
    modalIndex(modalContent,categories,works,modalBackground);
}

/**
 * Function name: closeModal
 * @param {HTMLElement} modalBackground - Modal background
 */
function closeModal (modalBackground) {
    modalBackground.classList.add("invisible");
}
/**
 * Setup one way to close the modal = the outside click
 * @param {HTMLElement} modalBackground - Modal background
 */
function closeModalsOutsideClick (modalBackground){
    modalBackground.addEventListener("click", (event) => {
        if (event.target === modalBackground) {
            closeModal (modalBackground);
        }
    })
}

/**
 * Create the modal with an actual gallery of works
 * @param {HTMLElement} modalContent - Modal content
 * @param {Array} categories - List of categories
 * @param {Array} works - List of works
 * @param {HTMLElement} modalBackground - Modal background
 */
async function modalIndex(modalContent, categories,works,modalBackground) {
    works = await actualizeLocalStorage("works", getWorks);
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
    modalContent.append(modalTitle,modalGallery,modalButton);

    // Create gallery in modal
    createGallery(works, modalGallery);
    
    // create delete button on each work part
    const figures = modalGallery.querySelectorAll("figure");
    figures.forEach((figure) => {
        figure.className = "modal-figure"; // remplacer la classe existante
        const id = figure.dataset.id // Récupération de l'id stocké lors de la creataion gallery
        
        // create delete button
        const deleteIcon = document.createElement("i");
              deleteIcon.classList.add("fa-solid", "fa-trash-can");
        const deleteButton = document.createElement("button");
              deleteButton.classList.add("delete-button");
              deleteButton.appendChild(deleteIcon);
        //insert button
        figure.appendChild(deleteButton);
        
        
        
        deleteWork(figure, deleteButton, id, works, gallery)
    });
    
    // Index'buttons to next modal beahavior
    modalButton.addEventListener("click", () => {
        modalAddPhoto(modalContent, categories,works,modalBackground);
    });
}

/**
 * Fonction to delete the works displayed on the modalgallery 
 * @param {HTMLElement} figure - Work figure element
 * @param {HTMLElement} deleteButton - Delete button element
 * @param {number} id - Work ID
 * @param {Array} works - List of works
 * @param {HTMLElement} gallery - Main gallery
 */
function deleteWork (figure, deleteButton, id, works, gallery) {
    // Delete button behavior
    
    deleteButton.addEventListener("click", async () => {
        const success = await deleteUrl(baseUrl+"works/",id)
        if (success) {
            figure.remove()
            works = await actualizeLocalStorage("works",getWorks) // "works" => nom de clé de stockage
            createGallery(works,gallery)
            lastCategory = null; // Reinitialise les filtres
        }
    })
}

/**
 * Create the 2nd modal with the formular to add works
 * @param {HTMLElement} modalContent - Modal content
 * @param {Array} categories - List of categories
 * @param {Array} works - List of works
 * @param {HTMLElement} modalBackground - Modal background
 */
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
    inputContainer.append(previewForm,labelPhoto,inputPhoto,uploadInfo);
    
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
          modalButton.classList.add("modal-button","modal-button-disabled");
        //   modalButton.disabled = true
          modalButton.textContent = "Valider";
          form.appendChild(modalButton)
    
    // create Message error area
    const messageToUser = document.createElement("p")
          messageToUser.classList.add("message-to-user","invisible")
          messageToUser.textContent= ""
          form.after(messageToUser)
    
    // Call for functions
    previewUpload(previewForm,inputPhoto)
    isFormFull(inputPhoto,inputTitle,selectCategories)
    setupFormListener (modalButton,inputPhoto,inputTitle,selectCategories)
    submitAddPhoto(works,form,inputPhoto,inputTitle,previewForm,selectCategories)
}

/**
 * Check if all form input are full
 * @param {HTMLInputElement} inputPhoto 
 * @param {HTMLInputElement} inputTitle 
 * @param {HTMLSelectElement} selectCategories 
 * @returns {boolean}
*/
function isFormFull (inputPhoto,inputTitle,selectCategories) {
    const file = inputPhoto.files[0]
    if (!file) return false
    if (!inputTitle.value.trim()) return false
    if (!selectCategories.value) return false
    return true
}


/**
 * Behavior of the submit button depending of the inputs = UX change 
 * @param {HTMLElement} modalButton
 * @param {HTMLInputElement} inputPhoto
 * @param {HTMLInputElement} inputTitle
 * @param {HTMLSelectElement} selectCategories
 */
function setupFormListener (modalButton,inputPhoto,inputTitle,selectCategories){
    //modalButtonSubmitUpdate est une fonction locale, 
    //utilise les closures pour accéder aux éléments du formulaire.
    function modalButtonSubmitUpdate (){
        const formFilled = isFormFull(inputPhoto,inputTitle,selectCategories)
        if (formFilled) {
            modalButton.classList.remove("modal-button-disabled")
        } else {
            modalButton.classList.add("modal-button-disabled")       
        }
    }
    inputPhoto.addEventListener("change",modalButtonSubmitUpdate)
    inputTitle.addEventListener("input",modalButtonSubmitUpdate)
    selectCategories.addEventListener("change",modalButtonSubmitUpdate)
    modalButtonSubmitUpdate()
}
/**
 * Fonction to show the user if he succeded to submit or to show an error  
 * @param {string} message
 */

function showMessageToUser (message){
    const messageToUser =document.querySelector(".message-to-user")
    messageToUser.classList.remove("invisible")
    messageToUser.textContent = message
}
/**Fonction to hide the error to the user
 * Function name: hideMessageError
 */
// function hideMessageError (){
//     const messageError =document.querySelector(".message-error")
//     messageError.classList.add("invisible")
//     messageError.textContent = ""
    
// }

/**
 * Behavior et verification of the submit to add works
 * @param {Array} works - List of works
 * @param {HTMLFormElement} form - Add photo form
 * @param {HTMLInputElement} inputPhoto
 * @param {HTMLInputElement} inputTitle
 * @param {HTMLImageElement} previewForm - Preview image
 * @param {HTMLSelectElement} selectCategories
 * @param {HTMLElement} modalBackground - Modal background
 */
function submitAddPhoto (works,form,inputPhoto,inputTitle,previewForm,selectCategories,) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formData = new FormData() // Ici on ne met rien en paramètre on déclare manuellement ce qu'on envoie ci-dessous sinon reprend chaque .name du form
        formData.append("image", inputPhoto.files[0]); // fichier
        formData.append("title", inputTitle.value.trim()); // texte
        formData.append("category", Number(selectCategories.value)); // id numérique
        const file = inputPhoto.files[0]
        if (!file) {
            showMessageToUser("Veuillez ajouter une image avant de valider")
            return
        }
        if (!checkFileSize(file, previewForm,inputPhoto)) {
            showMessageToUser("Attention le fichier sélectionné est supérieur à 4 mo")
            return
        }
        if (!inputTitle.value.trim()) {
            showMessageToUser("Veuillez donner un titre à votre photo" )
            console.log("erreur")
            return
        }
        if (!selectCategories.value) {
            showMessageToUser("Veuillez sélectionner une catégorie pour votre photo" )
            return         
        }
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        const success = await postUrl(baseUrl + "works/", formData)
        if (success) {
            console.log("Photo ajoutée!")
            works = await actualizeLocalStorage ("works", getWorks)
            showMessageToUser("Photo ajoutée avec succès")
            createGallery(works, gallery);
        } else {
            showMessageError("Erreur lors de l'envoie au serveur")
        }
    })
}


/**
 * Behavior of the preview for the futur work & restriction
 * @param {HTMLImageElement} previewForm
 * @param {HTMLInputElement} inputPhoto
 */
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

/**
 * Verification of size of the work
 * @param {File} file
 * @param {HTMLImageElement} previewForm
 * @param {HTMLInputElement} inputPhoto
 * @returns {boolean}
 */
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
    createFilterByCategories(categories)
    createGallery(works,gallery)
    activFilter(works)
    checkToken(categories,works)
}


//LogOut behavior
const logLink = document.getElementById ("log-link")
logLink.addEventListener("click", ()=>{
    const token = localStorage.getItem("token")
    if (token) {
        localStorage.removeItem("token")
        //Option de refresh auto expérience utilisateur manuel possible
        window.location.reload() 
        // editBanner.classList.add("invisible")
        // projectsContainer.classList.remove("projects-container-editor")
        // filterContainer.classList.remove("invisible")
        // modifButton.classList.add("invisible")
        // logLink.innerText = "login"
    } else{
        window.location.href ="login.html"
    }
})



init()



}) ()