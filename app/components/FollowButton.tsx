"use client";
import { useState } from "react";
export function FollowButton(){const [following,setFollowing]=useState(false);return <button className={following?"following":""} type="button" onClick={()=>setFollowing(value=>!value)}>{following?"Takiptesin ✓":"+ Takip Et"}</button>}
