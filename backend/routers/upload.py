"""File upload routes for logos and stamps"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime, timezone
import uuid
import os
import base64
import io
from bson import ObjectId
from pathlib import Path

from database import db
from models import UserRole
from auth import get_current_user, get_tenant_filter

router = APIRouter(prefix="/upload", tags=["Upload"])

# Directory for storing uploaded files
UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()


def is_valid_image(filename: str) -> bool:
    """Check if file has valid image extension"""
    return get_file_extension(filename) in ALLOWED_EXTENSIONS


@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload company logo - returns base64 data URL"""
    if not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Formati i file-it nuk lejohet. Përdorni: PNG, JPG, GIF, WEBP")
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File-i është shumë i madh. Maksimumi: 5MB")
    
    # Convert to base64 data URL
    ext = get_file_extension(file.filename).replace('.', '')
    if ext == 'jpg':
        ext = 'jpeg'
    base64_data = base64.b64encode(contents).decode('utf-8')
    data_url = f"data:image/{ext};base64,{base64_data}"
    
    # Update tenant's logo_url if user is tenant admin
    tenant_id = current_user.get("tenant_id")
    if tenant_id:
        await db.tenants.update_one(
            {"id": tenant_id},
            {"$set": {"logo_url": data_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"url": data_url, "message": "Logo u ngarkua me sukses"}


@router.post("/stamp")
async def upload_stamp(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload company digital stamp (vula digjitale) - returns base64 data URL"""
    if not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Formati i file-it nuk lejohet. Përdorni: PNG, JPG, GIF, WEBP")
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File-i është shumë i madh. Maksimumi: 5MB")
    
    # Convert to base64 data URL
    ext = get_file_extension(file.filename).replace('.', '')
    if ext == 'jpg':
        ext = 'jpeg'
    base64_data = base64.b64encode(contents).decode('utf-8')
    data_url = f"data:image/{ext};base64,{base64_data}"
    
    # Update tenant's stamp_url if user is tenant admin
    tenant_id = current_user.get("tenant_id")
    if tenant_id:
        await db.tenants.update_one(
            {"id": tenant_id},
            {"$set": {"stamp_url": data_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"url": data_url, "message": "Vula digjitale u ngarkua me sukses"}


@router.post("/tenant/{tenant_id}/logo")
async def upload_tenant_logo(
    tenant_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload logo for a specific tenant - Super Admin only"""
    if current_user.get("role") != UserRole.SUPER_ADMIN and current_user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Vetëm Super Admin mund të ngarkojë logo për firma të tjera")
    
    if not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Formati i file-it nuk lejohet. Përdorni: PNG, JPG, GIF, WEBP")
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File-i është shumë i madh. Maksimumi: 5MB")
    
    # Verify tenant exists
    tenant = await db.tenants.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Firma nuk u gjet")
    
    # Convert to base64 data URL
    ext = get_file_extension(file.filename).replace('.', '')
    if ext == 'jpg':
        ext = 'jpeg'
    base64_data = base64.b64encode(contents).decode('utf-8')
    data_url = f"data:image/{ext};base64,{base64_data}"
    
    await db.tenants.update_one(
        {"id": tenant_id},
        {"$set": {"logo_url": data_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"url": data_url, "message": "Logo u ngarkua me sukses"}


@router.post("/tenant/{tenant_id}/stamp")
async def upload_tenant_stamp(
    tenant_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload digital stamp for a specific tenant - Super Admin only"""
    if current_user.get("role") != UserRole.SUPER_ADMIN and current_user.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Vetëm Super Admin mund të ngarkojë vulën për firma të tjera")
    
    if not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Formati i file-it nuk lejohet. Përdorni: PNG, JPG, GIF, WEBP")
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File-i është shumë i madh. Maksimumi: 5MB")
    
    # Verify tenant exists
    tenant = await db.tenants.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Firma nuk u gjet")
    
    # Convert to base64 data URL
    ext = get_file_extension(file.filename).replace('.', '')
    if ext == 'jpg':
        ext = 'jpeg'
    base64_data = base64.b64encode(contents).decode('utf-8')
    data_url = f"data:image/{ext};base64,{base64_data}"
    
    await db.tenants.update_one(
        {"id": tenant_id},
        {"$set": {"stamp_url": data_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"url": data_url, "message": "Vula digjitale u ngarkua me sukses"}


@router.delete("/tenant/{tenant_id}/stamp")
async def delete_tenant_stamp(
    tenant_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete digital stamp for a tenant"""
    # Check if user is super admin or owns this tenant
    if current_user.get("role") != UserRole.SUPER_ADMIN and current_user.get("role") != "super_admin":
        if current_user.get("tenant_id") != tenant_id:
            raise HTTPException(status_code=403, detail="Nuk keni leje për këtë veprim")
    
    tenant = await db.tenants.find_one({"id": tenant_id})
    if not tenant:
        raise HTTPException(status_code=404, detail="Firma nuk u gjet")
    
    await db.tenants.update_one(
        {"id": tenant_id},
        {"$set": {"stamp_url": None, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Vula digjitale u fshi me sukses"}




# ============================================================

# SETUP FILE UPLOAD/DOWNLOAD - GridFS
import motor.motor_asyncio
from fastapi.responses import StreamingResponse
SETUP_APPS = {'datapos':'DataPOS','phonesoftware':'PhoneSoftware','bookpro':'BookPro','healthpro':'HealthPro'}
ALLOWED_SETUP_EXT = {'.exe','.zip','.msi'}

def get_gridfs():
    from database import db as _db
    return motor.motor_asyncio.AsyncIOMotorGridFSBucket(_db)

@router.post("/setup/{app_id}")
async def upload_setup(app_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Vetem Super Admin")
    if app_id not in SETUP_APPS:
        raise HTTPException(status_code=400, detail="App ID invalid")
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_SETUP_EXT:
        raise HTTPException(status_code=400, detail="Lejohen: .exe, .zip, .msi")
    contents = await file.read()
    bucket = get_gridfs()
    old = await db.setup_files.find_one({"app_id": app_id})
    if old and old.get("gridfs_id"):
        try: await bucket.delete(ObjectId(old["gridfs_id"]))
        except: pass
    file_id = await bucket.upload_from_stream(file.filename, io.BytesIO(contents))
    await db.setup_files.update_one({"app_id": app_id},
        {"$set": {"app_id":app_id,"app_name":SETUP_APPS[app_id],"filename":file.filename,
                  "ext":ext,"size":len(contents),"gridfs_id":str(file_id),
                  "uploaded_at":datetime.now(timezone.utc).isoformat()}}, upsert=True)
    return {"message":"U ngarkua!","filename":file.filename,"size":len(contents)}

@router.get("/setup/list")
async def list_setups(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Vetem Super Admin")
    files = []
    async for f in db.setup_files.find({}):
        f.pop("_id", None)
        f["file_exists"] = bool(f.get("gridfs_id"))
        files.append(f)
    return files

@router.delete("/setup/{app_id}")
async def delete_setup(app_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Vetem Super Admin")
    meta = await db.setup_files.find_one({"app_id": app_id})
    if meta and meta.get("gridfs_id"):
        try:
            bucket = get_gridfs()
            await bucket.delete(ObjectId(meta["gridfs_id"]))
        except: pass
    await db.setup_files.delete_one({"app_id": app_id})
    return {"message":"U fshi"}

@router.get("/setup/download/{app_id}")
async def download_setup(app_id: str):
    meta = await db.setup_files.find_one({"app_id": app_id})
    if not meta or not meta.get("gridfs_id"):
        raise HTTPException(status_code=404, detail="File nuk u gjet. Ngarkoje nga Setupat.")
    try:
        bucket = get_gridfs()
        stream = await bucket.open_download_stream(ObjectId(meta["gridfs_id"]))
        data = await stream.read()
        fname = meta.get("filename", f"{app_id}{meta.get('ext','.exe')}")
        return StreamingResponse(io.BytesIO(data), media_type="application/octet-stream",
            headers={"Content-Disposition": f'attachment; filename="{fname}"'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gabim: {str(e)}")


# SETUP FILE UPLOAD/DOWNLOAD - GridFS
import motor.motor_asyncio
from fastapi.responses import StreamingResponse

SETUP_APPS = {'datapos':'DataPOS','phonesoftware':'PhoneSoftware','bookpro':'BookPro','healthpro':'HealthPro'}
ALLOWED_SETUP_EXT = {'.exe','.zip','.msi'}

def get_gridfs():
    from database import db as _db
    return motor.motor_asyncio.AsyncIOMotorGridFSBucket(_db)

@router.post("/setup/{app_id}")
async def upload_setup(app_id:str,file:UploadFile=File(...),current_user:dict=Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403,detail="Vetem Super Admin")
    if app_id not in SETUP_APPS:
        raise HTTPException(status_code=400,detail="App ID invalid")
    ext=Path(file.filename).suffix.lower()
    if ext not in ALLOWED_SETUP_EXT:
        raise HTTPException(status_code=400,detail="Lejohen: .exe .zip .msi")
    contents=await file.read()
    from bson import ObjectId
    import io
    bucket=get_gridfs()
    old=await db.setup_files.find_one({"app_id":app_id})
    if old and old.get("gridfs_id"):
        try: await bucket.delete(ObjectId(old["gridfs_id"]))
        except: pass
    file_id=await bucket.upload_from_stream(file.filename,io.BytesIO(contents))
    await db.setup_files.update_one({"app_id":app_id},{"$set":{"app_id":app_id,"app_name":SETUP_APPS[app_id],"filename":file.filename,"ext":ext,"size":len(contents),"gridfs_id":str(file_id),"uploaded_at":datetime.now(timezone.utc).isoformat()}},upsert=True)
    return {"message":"U ngarkua!","filename":file.filename,"size":len(contents)}

@router.get("/setup/list")
async def list_setups(current_user:dict=Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403,detail="Vetem Super Admin")
    files=[]
    async for f in db.setup_files.find({}):
        f.pop("_id",None)
        f["file_exists"]=bool(f.get("gridfs_id"))
        files.append(f)
    return files

@router.delete("/setup/{app_id}")
async def delete_setup(app_id:str,current_user:dict=Depends(get_current_user)):
    if current_user.get("role") not in ["super_admin","SUPER_ADMIN"]:
        raise HTTPException(status_code=403,detail="Vetem Super Admin")
    from bson import ObjectId
    meta=await db.setup_files.find_one({"app_id":app_id})
    if meta and meta.get("gridfs_id"):
        try:
            bucket=get_gridfs()
            await bucket.delete(ObjectId(meta["gridfs_id"]))
        except: pass
    await db.setup_files.delete_one({"app_id":app_id})
    return {"message":"U fshi"}

@router.get("/setup/download/{app_id}")
async def download_setup(app_id:str):
    from bson import ObjectId
    import io
    meta=await db.setup_files.find_one({"app_id":app_id})
    if not meta or not meta.get("gridfs_id"):
        raise HTTPException(status_code=404,detail="File nuk u gjet.")
    try:
        bucket=get_gridfs()
        stream=await bucket.open_download_stream(ObjectId(meta["gridfs_id"]))
        data=await stream.read()
        fname=meta.get("filename",app_id+".exe")
        return StreamingResponse(io.BytesIO(data),media_type="application/octet-stream",headers={"Content-Disposition":"attachment; filename=\""+fname+"\"" })
    except Exception as e:
        raise HTTPException(status_code=500,detail="Gabim: "+str(e))


@router.post("/product-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload product image - returns base64 data URL"""
    if not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Formati nuk lejohet. Perdorni: PNG, JPG, GIF, WEBP")
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File-i eshte shume i madh. Maksimumi: 5MB")
    ext = get_file_extension(file.filename).replace(".", "")
    if ext == "jpg":
        ext = "jpeg"
    base64_data = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:image/{ext};base64,{base64_data}"
    return {"url": data_url, "message": "Foto e produktit u ngarkua me sukses"}
