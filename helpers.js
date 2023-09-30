export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const imagesStatic = [
    {
        name: 'temp1',
        url: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        name: 'temp2',
        url: 'https://images.pexels.com/photos/11229780/pexels-photo-11229780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        name: 'temp3',
        url: 'https://images.pexels.com/photos/10545418/pexels-photo-10545418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        name: 'temp4',
        url: 'https://images.pexels.com/photos/12681211/pexels-photo-12681211.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
    },
]

export const albumsStatic = [
    {
        name: 'Alb1'
    },
    {
        name: 'alb2'
    },
    {
        name: 'alb3'
    },
    {
        name: 'alb4'
    },
    {
        name: 'alb5'
    },
    {
        name: 'alb6'
    },
    {
        name: 'alb7'
    },
]