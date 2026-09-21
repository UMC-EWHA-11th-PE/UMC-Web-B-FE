import {useState, type ChangeEvent, type FormEvent} from "react";
import { useNavigate } from "react-router";
import type { UserProfile } from "../types/user";
import "./edit-profile-page.css";

interface EditProfilePageProps{
    profile:UserProfile,
    onSave:(profile:UserProfile)=>void;
}

export default function EditProfilePageProps({
    profile, onSave
}: EditProfilePageProps){
    const navigate=useNavigate();
    const [nickname, setNickname]=useState(profile.nickname);
    const [avatarUrl, setAvatarUrl]=useState(profile.avatarUrl);
    const [imageError, setImageError]=useState("");

    function handleImageChange(event: ChangeEvent<HTMLInputElement>){
        const file=event.target.files?.[0];
        if(!file) return;
        if(!file.type.startsWith("image/")|| file.size>5*1024*1024){
            setImageError("5MB 이하의 이미지 파일을 선택해주세요");
            event.target.value="";
            return;
        }

        setImageError("");
        const reader=new FileReader();

        reader.onload=()=>{
            if(typeof reader.result==="string"){
                setAvatarUrl(reader.result);
            }
        };

        reader.readAsDataURL(file);
    }
    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        onSave({
            ...profile, nickname:nickname.trim(), avatarUrl,
        });
        navigate("/me");
    }

    return (
        <main className="edit-profile-page">
            <div className="edit-profile-inner">
                <div className="edit-profile-heading">
                    <div>
                        <h1>내 정보 수정</h1>
                        <p>닉네임과 프로필 이미지만 변경할 수 있어요.</p>
                    </div>

                    <button className="save-profile-button" type="submit" form="profile-form">
                        변경사항 저장
                    </button>
                </div>

                <form id="profile-form" className="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="avatar-editor">
                        <label className="avatar-picker" htmlFor="profile-iamge">
                            <span className="avatar-preview">
                                <img
                                src={avatarUrl??"/icons/person.svg"}
                                alt={avatarUrl?"현재 프로필 이미지":""}
                                className={avatarUrl?"uploaded-avatar":""} />
                            </span>
                            <span className="avatar-edit-icon" aria-hidden="true">
                                <img src="/icons/edit.svg"/>
                            </span>
                            <span className="sr-only">프로필 이미지 변경</span>
                        
                        </label>
                        
                        <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />

            <strong>프로필 이미지</strong>
            <p>선택 사항 · 최대 5MB</p>
            {imageError && <p className="image-error" role="alert">{imageError}</p>}
          </div>

          <div className="profile-fields">
            <label htmlFor="edit-nickname">닉네임</label>
            <div className="profile-input with-button">
              <input
                id="edit-nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                minLength={2}
                maxLength={12}
                required
              />
              <button type="button">
                중복 확인
              </button>
            </div>

            <label htmlFor="edit-email">이메일</label>
            <div className="profile-input">
              <input
                id="edit-email"
                value={profile.email}
                readOnly
              />
            </div>
          </div>
        </form>

        <section className="withdraw-section" aria-label="회원 탈퇴">
          <div>
            <h2>회원 탈퇴</h2>
            <p>탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button type="button">회원 탈퇴</button>
        </section>
      </div>
    </main>
  );
}
                   