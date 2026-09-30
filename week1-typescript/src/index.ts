type member={
  id:number,
  name:string,
  github?:string
}


const members:member[]=[
  {id:1, name:"Yeong"},{id:2, name:"Seo", github:"SeoGithub"}
]

//const foundMember = members.find((member) => member.name === "현우");
// 배열에서 조건에 맞는 첫 번째 값을 찾는 메서드
function introduce(id:number){
  const member = members.find((m) => m.id === id);
  if (member) {
    console.log(`Hello, I'm ${member.name}`);
    if (member.github) {
      console.log(`You can find me on GitHub: ${member.github}`);
    }
  } else {
    console.log("Member not found");
  }
}

introduce(1); // Hello, I'm Yeong
introduce(2); // Hello, I'm Seo You can find me on GitHub: SeoGithub
introduce(999); // Member not found
