type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "지혜",
    role: "leader",
    githubId: "@jjihye-0108",
  },
  {
    id: 2,
    name: "은비",
    role: "member",
  },
  {
    id: 3,
    name: "미로",
    role: "member",
    githubId: "@kimhyeongryun",
  },
  {
    id: 4,
    name: "제이드",
    role: "member",
  },
  {
    id: 5,
    name: "조던",
    role: "member",
  },
];

function getMemberMessage(id: number): string {
  const member = members.find((member) => member.id === id);

  if(!member){
    return "회원을 찾을 수 없어요";
  }

   const githubId = member.githubId ?? "등록되지 않음";
   return (member.name + "님 / 역할: "+member.role + " / GithubId: " + githubId);
}

console.log(getMemberMessage(1));
console.log(getMemberMessage(2));
console.log(getMemberMessage(999));