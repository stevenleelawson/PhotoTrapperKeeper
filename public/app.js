
const getPhotos = async () => {
  try {
    const response = await fetch('/api/v1/photos', { mode: 'no-cors' });
    const photos = await response.json();
    await renderPhotos(photos)
  } catch(error) {
    throw new Error('unable to get projects' + error)
  }
}

let photoBucket = [];
const renderPhotos = (photos) => {
  $.each(photos, (index, photo) => {
    photoBucket.push(photo)
    $('.photo-section').append(
      `<section id=${photo.id} class='photo-box'>
        <h1>${photo.title}</h1>
        <img class="image" src=${photo.photo_url} />
        <button id=${photo.id} class='delete-photo'>Kill Photo</button>
      </section>`
    )
  })
}

function sanityCheck() {
  console.log('make it through')
}

console.log(photoBucket)
const postPhotos = async () => {
  const inputs = document.querySelectorAll('input');
  const body = {
    title: inputs[0].value,
    photo_url: inputs[1].value
  }
  $('.photo-section').append(
    `<section class='photo-box temp'>
      <h1>${body.title}</h1>
      <img class="image" src=${body.photo_url} />
      <button class='delete-photo'>Kill Photo</button>
    </section>`
  )
  const response = await fetch('/api/v1/photos', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  $('input').val('')
}

const deletePhoto = async (id) => {
  try {
    return await fetch(
      `/api/v1/photos/${id}`,
      {method: 'DELETE'}
    );
  } catch (error) {
    throw new Error('Unable to delete robot' + error)
  }
}

$('.photo-section').on('click', '.delete-photo', function(event){
  deletePhoto($(this).attr('id'))
  $(this).parents('.photo-box').remove();
})

$('.add-photo').on('click', postPhotos)



$( document ).ready(function() {
    getPhotos()
});
