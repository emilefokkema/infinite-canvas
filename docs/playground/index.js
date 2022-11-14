console.log('hello from the playground')
const searchParams = new URL(location.href).searchParams;
let projectId = 'use-cases/example1';
if(searchParams.has('projectId')){
    projectId = searchParams.get('projectId')
}
const newSearchParams = new URLSearchParams();
newSearchParams.set('projectId', projectId)
newSearchParams.set('type','2');
document.getElementById('iframe').setAttribute('src', `../dev/page?${newSearchParams}`)