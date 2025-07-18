"use client";
import styles from "./page.module.css";
import Button from "../components/Button";
import apple from "../../assets/apple.png";
import dailyq_mark from "../../assets/dailyq_mark.png";
import login_image from "../../assets/login_image.png";
import { useEffect } from "react";
import { SplashScreen } from "@capacitor/splash-screen";
import Swal from "sweetalert2";
import google from "../../assets/google.png";
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

const Login = () => {
  const router = useRouter();
   useEffect(() => {
      const hideSplash = async () => {
        // 최소 1초 대기 (네이티브 splash 유지)
        await new Promise((res) => setTimeout(res, 1000));
        await SplashScreen.hide();
      };
  
      hideSplash();
    }, []);

  

 async function appleLogin() {
  try {
    const response = await SignInWithApple.authorize({
      clientId: 'com.dailyq.animalalert.shop.web',
      redirectURI: 'https://dailyq.animalalert.shop/login',
      state: 'state',
    });
     const res = await fetch("https://dailyq.jeeyeonnn.site/account/apple-sign-in", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: response?.response?.authorizationCode,
        }),
      });
      const data = await res.json();
      const token = data?.access_token ;
        const is_signup_done = data?.is_signup_done;

        if (!token) {
            console.error("code가 없습니다.");
            return;
          }
        
          if (!is_signup_done) {
            Swal.fire({
              icon: 'info',
              title: '안내',
              html: '  [필수] 개인정보 수집 및 이용 동의 본 서비스는 로그인을 통해 사용자 ID를수집하여 로그인 및 계정 식별 목적으로만 이용합니다.<br></br> 수집 항목: 사용자 고유 ID 이용 목적: 로그인 기능 제공 및사용자 식별 <br></br>보유 기간: 회원 탈퇴 시 즉시 삭제 ※ 이름, 이메일 등기타 개인정보는 저장하지 않습니다.<br></br>또한, 본 서비스는 사용자 간 채팅 기능을 포함하고 있으며,<br></br> 채팅내에서 다음과 같은 행위를 금지합니다:<br></br> - 욕설, 성적 표현, 혐오발언 등 불쾌감을 주는 언행<br></br> - 개인정보 유출 또는 제3자의 권리를침해하는 행위<br></br> - 불법 행위의 권유 및 사기성 메시지 위반 시 경고없이 계정이 제한되거나 삭제될 수 있으며, 심각한 경우 법적 조치가 취해질수 있습니다.',
              showCancelButton: true,
              confirmButtonText: '동의합니다',
              cancelButtonText: '취소',
              confirmButtonColor: '#00664F',
              cancelButtonColor: '#ccc',
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem("token",token);
                router.replace("/signup2");
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: '이용 불가',
                  text: '서비스 이용을 위해 개인정보 수집 및 이용에 동의하셔야 합니다.',
                });
              }
            });
          } else {
            localStorage.setItem("is_signup_done", is_signup_done);
            localStorage.setItem("token",token);
            router.replace("/home");
          }
       
  } catch (error) {
    console.log(error);
  } 
  }
              


const login = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const data = await userInfoRes.json();
        console.log(data);
      const googleUserKey = data?.sub;
      const loginRes = await fetch("https://dailyq.jeeyeonnn.site/account/google-sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          google_user_key: googleUserKey,
        }),
      });
      console.log(loginRes);
      const data2 = await loginRes.json();
      localStorage.setItem("token",data2?.access_token);
      if(!data2?.is_signup_done){
         Swal.fire({
                    icon: 'info',
                    title: '안내',
                    html: '  [필수] 개인정보 수집 및 이용 동의 본 서비스는 로그인을 통해 사용자 ID를수집하여 로그인 및 계정 식별 목적으로만 이용합니다.<br></br> 수집 항목: 사용자 고유 ID 이용 목적: 로그인 기능 제공 및사용자 식별 <br></br>보유 기간: 회원 탈퇴 시 즉시 삭제 ※ 이름, 이메일 등기타 개인정보는 저장하지 않습니다.<br></br>또한, 본 서비스는 사용자 간 채팅 기능을 포함하고 있으며,<br></br> 채팅내에서 다음과 같은 행위를 금지합니다:<br></br> - 욕설, 성적 표현, 혐오발언 등 불쾌감을 주는 언행<br></br> - 개인정보 유출 또는 제3자의 권리를침해하는 행위<br></br> - 불법 행위의 권유 및 사기성 메시지 위반 시 경고없이 계정이 제한되거나 삭제될 수 있으며, 심각한 경우 법적 조치가 취해질수 있습니다.',
           showCancelButton: true,
  confirmButtonText: '동의합니다',
  cancelButtonText: '취소',
  confirmButtonColor: '#00664F',
  cancelButtonColor: '#ccc'
}).then((result) => {
  if (result.isConfirmed) {
    // ✅ 동의 처리
     router.replace("/signup2");
  } else {
    // ❌ 동의 거부 처리
    Swal.fire({
      icon: 'warning',
      title: '이용 불가',
      text: '서비스 이용을 위해 개인정보 수집 및 이용에 동의하셔야 합니다.',
      confirmButtonText: '확인'
    });
  }
});
      }else{
        localStorage.setItem("is_signup_done",data2?.is_signup_done);
        router.replace("/home");
      }
    } catch (err) {
      console.error("로그인 처리 중 오류:"+ err);
    }
  },
  onError: () => {
    console.log("구글 로그인 실패");
  },
});

const clientId = "1011059979743-b63b0puctcmudet5ed12sqckv76m1i8c.apps.googleusercontent.com";
const redirectUri = "com.googleusercontent.apps.1011059979743-b63b0puctcmudet5ed12sqckv76m1i8c:/oauth2redirect";

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?` + 
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    include_granted_scopes: 'true',
  });

 
  const handleGoogleOAuthNativeLogin = async () => {
    console.log('handleGoogleOAuthNativeLogin 시작');
  const params = new URLSearchParams();
  
  const listener = await App.addListener('appUrlOpen', async (event) => {
    const url = event.url;
    if (url?.startsWith(redirectUri)) {
      Browser.close();

      const code = new URL(url).searchParams.get('code');
      if (!code) return;

      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUri);

      try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const data = await res.json();
        const accessToken = data?.access_token;

        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data2 = await userInfoRes.json();
        const googleUserKey = data2?.sub;
        const loginRes = await fetch("https://dailyq.jeeyeonnn.site/account/google-sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            google_user_key: googleUserKey,
          }),
        });

        const data3 = await loginRes.json();
        localStorage.setItem("token", data3?.access_token);
        if (!data3?.is_signup_done) {
           Swal.fire({
                    icon: 'info',
                    title: '안내',
                    html: '  [필수] 개인정보 수집 및 이용 동의 본 서비스는 로그인을 통해 사용자 ID를수집하여 로그인 및 계정 식별 목적으로만 이용합니다.<br></br> 수집 항목: 사용자 고유 ID 이용 목적: 로그인 기능 제공 및사용자 식별 <br></br>보유 기간: 회원 탈퇴 시 즉시 삭제 ※ 이름, 이메일 등기타 개인정보는 저장하지 않습니다.<br></br>또한, 본 서비스는 사용자 간 채팅 기능을 포함하고 있으며,<br></br> 채팅내에서 다음과 같은 행위를 금지합니다:<br></br> - 욕설, 성적 표현, 혐오발언 등 불쾌감을 주는 언행<br></br> - 개인정보 유출 또는 제3자의 권리를침해하는 행위<br></br> - 불법 행위의 권유 및 사기성 메시지 위반 시 경고없이 계정이 제한되거나 삭제될 수 있으며, 심각한 경우 법적 조치가 취해질수 있습니다.',
           showCancelButton: true,
  confirmButtonText: '동의합니다',
  cancelButtonText: '취소',
  confirmButtonColor: '#00664F',
  cancelButtonColor: '#ccc'
}).then((result) => {
  if (result.isConfirmed) {
    // ✅ 동의 처리
    localStorage.setItem("is_signup_done", data2?.is_signup_done);
     router.replace("/signup2");
  } else {
    // ❌ 동의 거부 처리
    Swal.fire({
      icon: 'warning',
      title: '이용 불가',
      text: '서비스 이용을 위해 개인정보 수집 및 이용에 동의하셔야 합니다.',
      confirmButtonText: '확인'
    });
  }
});
        } else {
          localStorage.setItem("is_signup_done", data2?.is_signup_done);
          router.replace("/home");
        }
      } catch (error) {
        console.error("❌ 로그인 처리 오류:"+ error);
      }

      listener.remove(); // 반드시 리스너 제거!
    }
  });

  await Browser.open({ url: GOOGLE_AUTH_URL });
};



const googleLoginHandler = () =>{
  if(Capacitor.isNativePlatform()){
     handleGoogleOAuthNativeLogin();
  }else{
      
    login();
  }
}

  
 
 




  return (
    <div className={styles.Login}>
      <section className={styles.Login_img}>
        <div className={styles.Login_img_mark}>
          <img src={dailyq_mark.src} alt="" />
        </div>
        <div className={styles.Login_img_image}>
          <img src={login_image.src} alt="" />
        </div>
      </section>
      <section className={styles.Login_main}>
        <div className={styles.main_header_text}>처음이신가요?</div>
        <div className={styles.main_header_semitext}>
          소셜 로그인으로 가볍게 시작해보세요!
        </div>
        <div className={styles.main_button}>
          <button className={styles.apple_button} onClick={()=> appleLogin()}>
            <img src={apple.src} alt=""></img>
            <span>Sign with Apple</span>
          </button>
          <button className={styles.google_button} onClick={()=> googleLoginHandler()}  >
            <img src={google.src}/>
            <span>Sign with Google</span>
          </button>
          <Button
            onClick={() => router.replace("/simplelogin")}
            className={styles.nomal_button}
            text={"일반 로그인으로 이용하기"}
          ></Button>
          <Button
            onClick={() => router.replace("/signup")}
            className={styles.nomal_button}     
            text={"회원가입"}
          ></Button>
        </div>
      </section>
    </div>
  );
}

export default Login;
