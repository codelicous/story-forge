
export const initGame  = async(data: any): Promise<Game| undefined> =>{
    try {
        const response = await fetch('/api/initGame',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            console.error(response.status);
        }
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}