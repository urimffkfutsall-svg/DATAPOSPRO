import React, { useState, useEffect } from 'react';
import { api } from '../App';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Download,
  Upload,
  Filter,
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    purchase_price: '',
    sale_price: '',
    package_price: '',
    category: '',
    subcategory: '',
    vat_rate: '0',
    expiry_date: '',
    supplier: '',
    unit: 'copë',
    initial_stock: '',
    packages_count: '',
    items_per_package: '',
    branch_id: '',
  });

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = categoryFilter !== 'all' ? { category: categoryFilter } : {};
      const [productsRes, categoriesRes, branchesRes] = await Promise.all([
        api.get('/products', { params }),
        api.get('/categories'),
        api.get('/branches'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Gabim gjatë ngarkimit të produkteve');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image_url: reader.result, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Llogarit stokun total nga paketat
  const computedStock =
    formData.unit === 'pako' &&
    formData.packages_count &&
    formData.items_per_package
      ? parseFloat(formData.packages_count) * parseFloat(formData.items_per_package)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let initial_stock = formData.initial_stock ? parseFloat(formData.initial_stock) : 0;

      // Nëse është pako, stoku llogaritet automatikisht
      if (formData.unit === 'pako' && computedStock !== null) {
        initial_stock = computedStock;
      }

      const data = {
        ...formData,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        package_price: formData.package_price ? parseFloat(formData.package_price) : null,
        vat_rate: formData.vat_rate ? parseFloat(formData.vat_rate) : null,
        initial_stock,
        packages_count: formData.packages_count ? parseInt(formData.packages_count) : null,
        items_per_package: formData.items_per_package ? parseInt(formData.items_per_package) : null,
        branch_id: formData.branch_id || null,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
        toast.success('Produkti u përditësua me sukses');
      } else {
        await api.post('/products', data);
        toast.success('Produkti u shtua me sukses');
      }

      setShowDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë ruajtjes');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      barcode: product.barcode || '',
      purchase_price: product.purchase_price?.toString() || '',
      sale_price: product.sale_price?.toString() || '',
      package_price: product.package_price?.toString() || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      vat_rate: product.vat_rate?.toString() || '0',
      expiry_date: product.expiry_date || '',
      supplier: product.supplier || '',
      unit: product.unit || 'copë',
      initial_stock: '',
      packages_count: product.packages_count?.toString() || '',
      items_per_package: product.items_per_package?.toString() || '',
      branch_id: product.branch_id || '',
    });
    setShowDialog(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Jeni të sigurt që doni të fshini produktin "${product.name || product.id}"?`)) {
      return;
    }
    try {
      await api.delete(`/products/${product.id}`);
      toast.success('Produkti u fshi me sukses');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë fshirjes');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      barcode: '',
      purchase_price: '',
      sale_price: '',
      package_price: '',
      category: '',
      subcategory: '',
      vat_rate: '0',
      expiry_date: '',
      supplier: '',
      unit: 'copë',
      initial_stock: '',
      packages_count: '',
      items_per_package: '',
      branch_id: '',
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Pa stok', variant: 'destructive' };
    if (stock < 10) return { label: 'I ulët', variant: 'warning' };
    return { label: 'Në stok', variant: 'success' };
  };

  return (
    <div className="space-y-6" data-testid="products-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produktet</h1>
          <p className="text-gray-500">Menaxho produktet e marketit</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Eksporto
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importo
          </Button>
          <Button
            className="bg-[#00a79d] hover:bg-[#008f86] gap-2"
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            data-testid="add-product-btn"
          >
            <Plus className="h-4 w-4" />
            Shto Produkt
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kërko sipas emrit, barkodit ose kategorisë..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="search-products"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="category-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Të gjitha</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nuk u gjetën produkte</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Emri</TableHead>
                  <TableHead>Barkodi</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead className="text-right">Ç. Blerjes</TableHead>
                  <TableHead className="text-right">Ç. Shitjes</TableHead>
                  <TableHead className="text-center">Stoku</TableHead>
                  <TableHead className="text-center">Statusi</TableHead>
                  <TableHead className="text-right">Veprime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.current_stock);
                  const isPako = product.unit === 'pako';
                  return (
                    <TableRow key={product.id} className="table-row-hover">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span>{product.name || '-'}</span>
                          {isPako && product.items_per_package && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                              <Package className="h-3 w-3" />
                              Pako · {product.items_per_package} copë/pako
                              {product.package_price ? ` · €${parseFloat(product.package_price).toFixed(2)}/pako` : ''}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.barcode || '-'}</TableCell>
                      <TableCell>{product.category || '-'}</TableCell>
                      <TableCell className="text-right">
                        {product.purchase_price ? `€${product.purchase_price.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {product.sale_price ? `€${product.sale_price.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-center">{product.current_stock || 0}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={stockStatus.variant}
                          className={
                            stockStatus.variant === 'success'
                              ? 'bg-green-100 text-green-700'
                              : stockStatus.variant === 'warning'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            data-testid={`edit-product-${product.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(product)}
                            data-testid={`delete-product-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modifiko Produktin' : 'Shto Produkt të Ri'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">

              <div className="space-y-2">
                <Label htmlFor="name">Emri</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Emri i produktit"
                  data-testid="product-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barkodi</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Barkodi"
                  data-testid="product-barcode-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_price">Çmimi i Blerjes (€)</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  placeholder="0.00"
                  data-testid="product-purchase-price-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price">Çmimi i Shitjes (€)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                  placeholder="0.00"
                  data-testid="product-sale-price-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="p.sh. Ushqimore"
                  data-testid="product-category-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Nënkategoria</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="p.sh. Qumësht"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat_rate">TVSH (%)</Label>
                <Select
                  value={formData.vat_rate}
                  onValueChange={(value) => setFormData({ ...formData, vat_rate: value })}
                >
                  <SelectTrigger data-testid="product-vat-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Njësia Matëse</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      unit: value,
                      packages_count: '',
                      items_per_package: '',
                      package_price: '',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copë">Copë</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="l">Litër</SelectItem>
                    <SelectItem value="m">Metër</SelectItem>
                    <SelectItem value="pako">Pako</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ===== PAKO FIELDS ===== */}
              {formData.unit === 'pako' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="packages_count">Sa Pako</Label>
                    <Input
                      id="packages_count"
                      type="number"
                      min="1"
                      value={formData.packages_count}
                      onChange={(e) => setFormData({ ...formData, packages_count: e.target.value })}
                      placeholder="Nr. i pakove"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="items_per_package">Sa produkte në pako</Label>
                    <Input
                      id="items_per_package"
                      type="number"
                      min="1"
                      value={formData.items_per_package}
                      onChange={(e) => setFormData({ ...formData, items_per_package: e.target.value })}
                      placeholder="Copë për pako"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="package_price">Çmimi i Pakos (€)</Label>
                    <Input
                      id="package_price"
                      type="number"
                      step="0.01"
                      value={formData.package_price}
                      onChange={(e) => setFormData({ ...formData, package_price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Stoku i llogaritur automatikisht */}
                  {computedStock !== null && (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-sm text-blue-700">
                        <Package className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Stoku total:{' '}
                          <strong>
                            {computedStock} copë
                          </strong>{' '}
                          ({formData.packages_count} pako × {formData.items_per_package} copë/pako)
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* ===== FUND PAKO FIELDS ===== */}

              <div className="space-y-2">
                <Label htmlFor="supplier">Furnitori</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Emri i furnitorit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Data e Skadencës</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>

              {/* Stoku fillestar — vetëm nëse nuk është pako dhe nuk jemi në edit */}
              {!editingProduct && formData.unit !== 'pako' && (
                <div className="space-y-2">
                  <Label htmlFor="initial_stock">Stoku Fillestar</Label>
                  <Input
                    id="initial_stock"
                    type="number"
                    value={formData.initial_stock}
                    onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                    placeholder="0"
                    data-testid="product-stock-input"
                  />
                </div>
              )}

              {branches.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="branch">Dega</Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Zgjidh degën" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Të gjitha</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Anulo
              </Button>
              <Button
                type="submit"
                className="bg-[#00a79d] hover:bg-[#008f86]"
                data-testid="save-product-btn"
              >
                {editingProduct ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;