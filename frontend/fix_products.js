const fs = require('fs');
const file = 'src/pages/Products.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Shto image_url ne formData
content = content.replace(
  "branch_id: ''\n});",
  "branch_id: '',\n  image_url: '',\n  imageFile: null\n});"
);

// 2. Shto handleImageChange para handleSubmit
content = content.replace(
  'const handleSubmit = async (e)',
  `const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image_url: reader.result, imageFile: file }));
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (e)`
);

// 3. Shto fushen Foto pas bllokut te Deges
content = content.replace(
  `<Label htmlFor="branch">Dega</Label>`,
  `<Label htmlFor="branch">Dega</Label>`
);

// Shto fushen e fotos para DialogFooter
content = content.replace(
  '<DialogFooter>',
  `<div className="space-y-2">
  <Label htmlFor="product_image">Foto Produktit</Label>
  <Input
    id="product_image"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />
  {formData.image_url && (
    <img
      src={formData.image_url}
      alt="Foto produktit"
      className="mt-2 h-24 w-24 object-cover rounded-md border"
    />
  )}
</div>
<DialogFooter>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Products.jsx u ndryshua me sukses!');