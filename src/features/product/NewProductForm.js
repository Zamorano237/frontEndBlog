/** @format */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewProductMutation } from './productApiSlice';

import { FormGroup, Input, Label, Button, Form, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NewPostForm = ({ users }) => {
  const sendFiles = async () => {
    console.log('bonjour');
    // Object
    const myFiles = document.getElementById('myFiles').files;

    const formData = new FormData();

    Object.keys(myFiles).forEach((key) => {
      formData.append(myFiles.item(key).name, myFiles.item(key));
    });

    const response = await fetch('http://localhost:3500/upload', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    console.log(json);
  };

  const [addNewProduct, { isLoading, isSuccess, isError, error }] =
    useAddNewProductMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState();

  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImageUrl('');
      setVideoUrl('');
      navigate('/products');
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onPriceChanged = (e) => setPrice(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);
  const onImageUrlChanged = (e) => setImageUrl(e.target.value);
  const onVideoUrlChanged = (e) => setVideoUrl(e.target.value);

  const canSave =
    [title, description, price, category, imageUrl, videoUrl].every(Boolean) &&
    !isLoading;

  const onSaveProductClicked = async (e) => {
    alert('click');
    sendFiles();
    console.log({ title, description, price, category, imageUrl, videoUrl });
    e.preventDefault();
    if (canSave) {
      await addNewProduct({
        title,
        description,
        price,
        category,
        imageUrl,
        videoUrl,
      });
    }
  };
  const styles = {
    preview: {
      width: 500,
      height: 'auto',
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
    },
    image: { maxWidth: '100%', maxHeight: 320 },
    delete: {
      cursor: 'pointer',
      padding: 15,
      background: 'red',
      color: 'white',
      border: 'none',
    },
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validDescriptionClass = !description ? 'form__input--incomplete' : '';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <div
        style={{
          width: '900px',
          margin: 'auto',
          border: '2px solid black',
          padding: '30px',
        }}>
        <Form id='uploadForm'>
          <h1> Ajout des informations sur un produit </h1>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for='exampleEmail'>Nom du produit</Label>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name='title'
                  placeholder='Inserer le nom du produit'
                  type='texte'
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='price'>Price</Label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  id='price'
                  name='price'
                  placeholder='Donnez le prix du produit $'
                  type='number'
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='category'>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id='category'
                  name='select'
                  placeholder='Donnez le prix du produit $'
                  type='select'>
                  <option></option>
                  <option>Tableaux de Bord Power BI</option>
                  <option>Tableaux de Bord Excel</option>
                  <option>Tableaux de Bord PowerPoint</option>
                  <option>Présentation PowerPoint</option>
                  <option>Kit Documentaire</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for='description'>Description du produit</Label>
            <Input
              value={description}
              type='textarea'
              onChange={(e) => setDescription(e.target.value)}
              id='description'
              name='description'
              placeholder='Décrire le produit'
            />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for='myFiles'>imageUrl</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                  type='file'
                  id='myFiles'
                  accept='image/*'
                  multiple
                  className='form-control'
                />{' '}
                <br />
                {selectedImage && (
                  <div style={styles.preview}>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      style={styles.image}
                      alt='Thumb'
                    />
                    <button onClick={removeSelectedImage} style={styles.delete}>
                      Remove This Image
                    </button>
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='videoUrl'>VideoUrl</Label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  id='videoUrl'
                  type='text'
                  name='videoUrl'
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup check style={{ paddingTop: 40 }}>
                <Label check for='check'>
                  Active
                </Label>
                <Input id='check' name='check' type='checkbox' />
              </FormGroup>
            </Col>
          </Row>
          <Button onClick={onSaveProductClicked}>Click</Button>
        </Form>
      </div>
    </>
  );

  return content;
};

export default NewPostForm;
