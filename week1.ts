type MemberRole = "leader" | "member";

interface StudyMember {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
}

const members: StudyMember[] = [
    {
        id: 1,
        name: "은비",
        role: "leader",
        githubId: "Eunbi2741"
    },
    {
        id: 2,
        name: "철수",
        role: "member"
    },
    {
        id: 3,
        name: "영희",
        role: "member",
        githubId: "younghee"
    }
];

function findMember(id: number): string {
    const member = members.find((member) => member.id === id);

    if (member === undefined) {
        return "해당 회원을 찾을 수 없습니다.";
    }

    const github = member.githubId ?? "등록되지 않음";

    return member.name + "님은" + member.role + "이고 GitHub ID는" + github + "입니다.";
}

console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));
